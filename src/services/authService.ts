import { User } from "../models/User";
import bcrypt from "bcrypt";
import sanitize from "mongo-sanitize";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/mailer";

class AuthService {

  async register(username: string, email: string, password: string) {
    username = sanitize(username);
    email = sanitize(email);

    const existingUser = await User.findOne({ email });

    // Se já existe e já confirmou email → bloquear
    if (existingUser && existingUser.isVerified) {
      throw {
        statusCode: 400,
        message: "Usuário já existe",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    let user;

    // Se existe mas não confirmou → atualizar dados
    if (existingUser && !existingUser.isVerified) {
      existingUser.username = username;
      existingUser.password = hashedPassword;
      existingUser.verificationToken = verificationToken;
      await existingUser.save();
      user = existingUser;
    } else {
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: false
      });
    }

    await sendVerificationEmail(email, verificationToken);

    return {
      message: "Verifique seu email para ativar a conta",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };
  }

  async login(email: string, password: string) {
    email = sanitize(email);

    const user = await User.findOne({ email });

    if (!user) {
      throw { statusCode: 404, message: "Usuário não encontrado" };
    }

    if (!user.isVerified) {
      throw { statusCode: 401, message: "Verifique seu email antes de fazer login" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw { statusCode: 401, message: "Senha inválida" };
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      message: "Login realizado com sucesso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  // ✅ deleteAccount
  async deleteAccount(userId: string) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw { statusCode: 404, message: "Usuário não encontrado" };
    }

    return { message: "Conta deletada com sucesso" };
  }
}

export const authService = new AuthService();