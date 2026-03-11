import request from "supertest";
import { buildApp } from "../src/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../src/models/User";

let app: any;
let mongoServer: MongoMemoryServer;
let token: string;

// 🔹 Gerador de usuário de teste
function createTestUser(prefix: string = "item") {

  const id = Date.now() + Math.floor(Math.random() * 1000);

  const user = {
    username: "Alvaro",
    email: `${prefix}${id}@gmail.com`,
    password: `senha${id}`
  };

  console.log("👤 Usuário gerado:", user);

  return user;
}

beforeAll(async () => {

  console.log("🚀 Iniciando MongoMemoryServer...");

  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();

  console.log("📦 URI do Mongo em memória:", uri);

  app = await buildApp(uri);

  await app.ready();

  console.log("✅ App pronto para testes");

});

afterAll(async () => {

  console.log("🧹 Encerrando conexões...");

  await mongoose.connection.close();

  await mongoServer.stop();

  await app.close();

  console.log("✅ Testes finalizados");

});

describe("Items API", () => {

  beforeAll(async () => {

    console.log("\n🔐 Preparando usuário para testes de itens");

    const user = createTestUser("crud");

    const register = await request(app.server)
      .post("/auth/register")
      .send(user);

    console.log("📥 Register response:", register.statusCode);

    await User.updateOne(
      { email: user.email },
      { isVerified: true }
    );

    console.log("✅ Usuário verificado");

    const login = await request(app.server)
      .post("/auth/login")
      .send({
        email: user.email,
        password: user.password
      });

    console.log("🔑 Login status:", login.statusCode);
    console.log("🔑 Login body:", login.body);

    token = login.body.token;

    console.log("🎫 Token recebido:", token);

  });

  it("deve criar um item", async () => {

    console.log("\n📦 Testando criação de item");

    const response = await request(app.server)
      .post("/items")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Arroz",
        quantity: 2,
        price: 10
      });

    console.log("📥 Response create item:", response.statusCode);
    console.log("📥 Body:", response.body);

    expect(response.statusCode).toBe(201);

    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("quantity");
    expect(response.body).toHaveProperty("price");

  });

  it("deve listar os itens do usuário", async () => {

    console.log("\n📋 Testando listagem de itens");

    const user = createTestUser("list");

    const register = await request(app.server)
      .post("/auth/register")
      .send(user);

    console.log("📥 Register status:", register.statusCode);

    await User.updateOne(
      { email: user.email },
      { isVerified: true }
    );

    const login = await request(app.server)
      .post("/auth/login")
      .send({
        email: user.email,
        password: user.password
      });

    console.log("🔑 Login status:", login.statusCode);

    const token = login.body.token;

    console.log("🎫 Token:", token);

    const createItem = await request(app.server)
      .post("/items")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Arroz",
        quantity: 2,
        price: 10
      });

    console.log("📦 Create item status:", createItem.statusCode);
    console.log("📦 Create item body:", createItem.body);

    const response = await request(app.server)
      .get("/items")
      .set("Authorization", `Bearer ${token}`);

    console.log("📋 GET /items status:", response.statusCode);
    console.log("📋 GET /items body:", response.body);

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body.length).toBeGreaterThan(0);

  });

  it("deve atualizar um item", async () => {

  console.log("\n✏️ Testando atualização de item");

  const user = createTestUser("update");

  const register = await request(app.server)
    .post("/auth/register")
    .send(user);

  console.log("📥 Register:", register.statusCode);

  await User.updateOne(
    { email: user.email },
    { isVerified: true }
  );

  const login = await request(app.server)
    .post("/auth/login")
    .send({
      email: user.email,
      password: user.password
    });

  console.log("🔑 Login:", login.statusCode);

  const token = login.body.token;

  const created = await request(app.server)
    .post("/items")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Feijão",
      quantity: 1,
      price: 8
    });

  console.log("📦 Item criado:", created.body);

  const itemId = created.body._id;

  const response = await request(app.server)
    .patch(`/items/${itemId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      purchased: true
    });

  console.log("📥 PATCH status:", response.statusCode);
  console.log("📥 PATCH body:", response.body);

  expect(response.statusCode).toBe(200);

  expect(response.body.purchased).toBe(true);

});

it("deve deletar um item", async () => {

  console.log("\n🗑️ Testando remoção de item");

  const user = createTestUser("delete");

  const register = await request(app.server)
    .post("/auth/register")
    .send(user);

  console.log("📥 Register:", register.statusCode);

  await User.updateOne(
    { email: user.email },
    { isVerified: true }
  );

  const login = await request(app.server)
    .post("/auth/login")
    .send({
      email: user.email,
      password: user.password
    });

  console.log("🔑 Login:", login.statusCode);

  const token = login.body.token;

  const created = await request(app.server)
    .post("/items")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Macarrão",
      quantity: 3,
      price: 5
    });

  console.log("📦 Item criado:", created.body);

  const itemId = created.body._id;

  const response = await request(app.server)
    .delete(`/items/${itemId}`)
    .set("Authorization", `Bearer ${token}`);

  console.log("📥 DELETE status:", response.statusCode);
  console.log("📥 DELETE body:", response.body);

  expect(response.statusCode).toBe(200);

});

});