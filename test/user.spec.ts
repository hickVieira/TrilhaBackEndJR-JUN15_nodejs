import supertest from "supertest"
import { User, UserWithId } from "../src/models/UserModels"
import Database from "../src/database/Database"
import dotenv from "dotenv"
import utils from "../src/utils"
import njwt from 'njwt';
import test_utils from "./test_utils"
import { StatusCodes } from "http-status-codes"
dotenv.config()

const request = supertest(`http://${process.env.APP_HOST}:${process.env.APP_PORT}`)

async function resetDabase() {
    dotenv.config()
    await Database.reset()
}

describe("User", () => {
    beforeEach(async () => {
        await resetDabase()
    })

    it("should get all users as admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
        const response = await request.get("/users")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
    })

    it("should fail to get all users as non-admin", async () => {
        const response = await request.get("/users")
        expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should get a user by id as admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
        const response = await request.get("/users/1")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("password");
    })

    it("should failt to get a user by id as non-admin", async () => {
        const response = await request.get("/users/1")
        expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should create a user", async () => {
        const response = await request.post("/users").send({
            name: "testName",
            email: "test@email.com",
            password: "test123Abc",
            isAdmin: false
        })
        expect(response.status).toBe(StatusCodes.CREATED)
    })

    it("should login a user", async () => {
        const response = await request.post("/login").send({
            email: "john@example.com",
            password: "password123"
        })
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("token")
    })

    it("should update/put a user as admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")

        const response1 = await request.put(`/users/${payload.id}`)
            .send({
                name: "John Doe New Name",
                email: "john-new-email@example.com",
                password: "password123-new-password",
                isAdmin: true
            })
            .set("Authorization", `Bearer ${userToken}`)
        expect(response1.status).toBe(StatusCodes.OK)

        // check if the user was updated
        const response2 = await request.get(`/users/${payload.id}`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(response2.status).toBe(StatusCodes.OK)
        expect(response2.body).toHaveProperty("name", "John Doe New Name")
        expect(response2.body).toHaveProperty("email", "john-new-email@example.com")
        expect(response2.body).toHaveProperty("password", "password123-new-password")
        expect(response2.body).toHaveProperty("isAdmin", 1)

    })

    it("should update/patch a user as a user", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")

        const response1 = await request.patch(`/users/${payload.id}`)
            .send({
                name: "John Doe New Name",
                email: "john-new-email@example.com",
                password: "password123-new-password"
            })
            .set("Authorization", `Bearer ${userToken}`)
        expect(response1.status).toBe(StatusCodes.OK)

        // check if the user was updated
        const response2 = await request.get(`/users/${payload.id}`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(response2.status).toBe(StatusCodes.OK)
        expect(response2.body).toHaveProperty("name", "John Doe New Name")
        expect(response2.body).toHaveProperty("email", "john-new-email@example.com")
        expect(response2.body).toHaveProperty("password", "password123-new-password")
        expect(response2.body).toHaveProperty("isAdmin", 1)
    })

    it("should delete a user as admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")

        const response = await request.delete(`/users/${payload.id}`)
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.status).toBe(StatusCodes.OK)
    })
})