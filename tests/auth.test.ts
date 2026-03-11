import request from "supertest";
import { buildApp } from "../src/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../src/models/User";

let app: any;
let mongoServer: MongoMemoryServer;

// 🔹 Gerador de usuário de teste
function createTestUser(prefix: string = "teste") {

  const id = Date.now() + Math.floor(Math.random() * 1000);

  return {
    username: "Alvaro",
    email: `${prefix}${id}@gmail.com`,
    password: `senha${id}`
  };

}

beforeAll(async () => {

  // cria MongoDB em memória
  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();

  app = await buildApp(uri);

  await app.ready();

});

afterAll(async () => {

  await mongoose.connection.close();

  await mongoServer.stop();

  await app.close();

});

describe("Auth API", () => {

  it("deve responder que a API está funcionando", async () => {

    const response = await request(app.server)
      .get("/");

    expect(response.statusCode).toBe(200);

  });

  it("deve registrar um novo usuário", async () => {

    const user = createTestUser();

    const response = await request(app.server)
      .post("/auth/register")
      .send(user);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");

  });

  it("deve permitir registrar novamente se email não estiver verificado", async () => {

    const user = createTestUser("duplicado");

    await request(app.server)
      .post("/auth/register")
      .send(user);

    const response = await request(app.server)
      .post("/auth/register")
      .send({
        username: "Alvaro2",
        email: user.email,
        password: user.password
      });

    expect(response.statusCode).toBe(200);

  });

  it("deve fazer login e retornar token", async () => {

    const user = createTestUser("login");

    await request(app.server)
      .post("/auth/register")
      .send(user);

    await User.updateOne(
      { email: user.email },
      { isVerified: true }
    );

    const response = await request(app.server)
      .post("/auth/login")
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");

  });

  it("deve bloquear delete sem token", async () => {

    const response = await request(app.server)
      .delete("/auth/delete");

    expect(response.statusCode).toBe(401);

  });

});