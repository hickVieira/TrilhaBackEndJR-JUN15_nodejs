import supertest from "supertest"
import { User } from "../src/models/UserModels"
import Database from "../src/database/Database"
import dotenv from "dotenv"

const request = supertest("http://localhost:3000")

async function resetDabase() {
    dotenv.config()
    await Database.reset()
}

describe("User", () => {
    beforeEach(async () => {
        await resetDabase()
    })

    it("should get all users", async () => {
        const response = await request.get("/users")
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
    })

    it("should get a user by id", async () => {
        const response = await request.get("/users/1")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("password");
    })

    it("should create a user", async () => {
        const response = await request.post("/users").send({
            name: "testName",
            email: "test@email.com",
            password: "test123Abc"
        })
        expect(response.status).toBe(201)
    })

    it("should login a user", async () => {
        const response = await request.post("/login").send({
            email: "john@example.com",
            password: "password123"
        })
        expect(response.status).toBe(200)
        console.log(response.body)
    })

    it("should update a user", async () => {
        const response = await request.put("/users/1").send({
            name: "John Doe New Name",
            email: "john-new-email@example.com",
            password: "password123-new-password"
        })
        expect(response.status).toBe(200)
    })

    it("should delete a user", async () => {
        const response = await request.delete("/users/1")
        expect(response.status).toBe(200)
    })
})