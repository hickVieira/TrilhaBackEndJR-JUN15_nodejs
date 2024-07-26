import supertest from "supertest"
import test_utils from "./test_utils"
import { StatusCodes } from "http-status-codes"

describe("User routes tests", () => {

    let request: supertest.Agent;

    beforeAll(async () => {
        request = await test_utils.get_connection();
    })

    beforeEach(async () => {
        await test_utils.resetDabase(request)
    })

    it("should login a user", async () => {
        const response = await request.post("/login").send({
            email: "john@example.com",
            password: "password123"
        })
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("User logged in successfully")
        expect(response.body).toHaveProperty("token")
    })

    it("should get all users as admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
        const response = await request.get("/users")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("email");
        expect(response.body[0]).toHaveProperty("password");
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

    it("should register a user", async () => {
        const response = await request.post("/register").send({
            name: "testName",
            email: "test@email.com",
            password: "test123Abc",
        })
        expect(response.status).toBe(StatusCodes.CREATED)
        expect(response.body).toHaveProperty("token")
    })

    it("should fail to register a user that already exists", async () => {
        const response = await request.post("/register").send({
            name: "testName",
            email: "john@example.com",
            password: "test123Abc",
        })
        expect(response.status).toBe(StatusCodes.CONFLICT)
    })

    it("should put a user as a admin", async () => {
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
        expect(response2.body).toHaveProperty("isAdmin", true)
    })

    it("should fail to put a user as a non-admin", async () => {
        const response = await request.put("/users/1")
            .send({
                name: "John Doe New Name",
                email: "john-new-email@example.com",
                password: "password123-new-password",
                isAdmin: true
            })
        expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should patch a user as a logged user", async () => {
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
        expect(response2.body).toHaveProperty("isAdmin", true)
    })

    it("should fail to patch a user that is not the logged in user", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "jane@example.com", "qwerty123")
        const response = await request.patch("/users/1")
            .send({
                name: "John Doe New Name",
                email: "john-new-email@example.com",
                password: "password123-new-password"
            })
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.FORBIDDEN)
    })

    it("should delete a user as admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")

        const response = await request.delete(`/users/${payload.id}`)
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.status).toBe(StatusCodes.OK)
    })

    it("should fail to delete a user as a non-user", async () => {
        const response = await request.delete("/users/1")
        expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should fail to delete a user as non-admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "jane@example.com", "qwerty123")
        const response = await request.delete("/users/1")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.FORBIDDEN)
    })
})