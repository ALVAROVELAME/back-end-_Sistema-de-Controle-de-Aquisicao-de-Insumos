import { User } from "../models/User";
import bcrypt from "bcrypt";

class AuthService {
  async register(username: string, email: string, password: string) {

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw {
        statusCode: 400,
        message: "Usuário já existe",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return {
      message: "Usuário criado com sucesso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(email: string, password: string) {

    const user = await User.findOne({ email });

    if (!user) {
      throw {
        statusCode: 404,
        message: "Usuário não encontrado",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw {
        statusCode: 401,
        message: "Senha inválida",
      };
    }

    return {
      message: "Login realizado com sucesso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }
}

export const authService = new AuthService();