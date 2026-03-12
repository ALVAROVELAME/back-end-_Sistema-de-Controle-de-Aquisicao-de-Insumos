"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const User_1 = require("../src/models/User");
let app;
let mongoServer;
// 🔹 Gerador de usuário de teste
function createTestUser(prefix = "teste") {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    return {
        username: "Alvaro",
        email: `${prefix}${id}@gmail.com`,
        password: `senha${id}`
    };
}
beforeAll(async () => {
    // cria MongoDB em memória
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    app = await (0, app_1.buildApp)(uri);
    await app.ready();
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
    await mongoServer.stop();
    await app.close();
});
describe("Auth API", () => {
    it("deve responder que a API está funcionando", async () => {
        const response = await (0, supertest_1.default)(app.server)
            .get("/");
        expect(response.statusCode).toBe(200);
    });
    it("deve registrar um novo usuário", async () => {
        const user = createTestUser();
        const response = await (0, supertest_1.default)(app.server)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
    it("deve permitir registrar novamente se email não estiver verificado", async () => {
        const user = createTestUser("duplicado");
        await (0, supertest_1.default)(app.server)
            .post("/auth/register")
            .send(user);
        const response = await (0, supertest_1.default)(app.server)
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
        await (0, supertest_1.default)(app.server)
            .post("/auth/register")
            .send(user);
        await User_1.User.updateOne({ email: user.email }, { isVerified: true });
        const response = await (0, supertest_1.default)(app.server)
            .post("/auth/login")
            .send({
            email: user.email,
            password: user.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
    });
    it("deve bloquear delete sem token", async () => {
        const response = await (0, supertest_1.default)(app.server)
            .delete("/auth/delete");
        expect(response.statusCode).toBe(401);
    });
});
