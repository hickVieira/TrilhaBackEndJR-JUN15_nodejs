import supertest from "supertest"
import test_utils from "./test_utils"
import { StatusCodes } from "http-status-codes"
import utils from "../src/utils";

describe("E2E test that creates a user, logins a user, creates a task as a logged user, and deletes the task", () => {

    let request: supertest.Agent;

    beforeAll(async () => {
        request = await test_utils.get_connection();
        await test_utils.resetDabase(request)
    })

    it("should create a user account", async () => {
        const response = await request.post("/register").send({
            name: "Test User",
            email: "test@email.com",
            password: "pass123"
        })
        expect(response.status).toBe(StatusCodes.CREATED)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("User created successfully")
        expect(response.body).toHaveProperty("token")
    })

    let userToken: string;
    it("should login a user", async () => {
        const response = await request.post("/login")
            .send({
                email: "test@email.com",
                password: "pass123"
            })
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("User logged in successfully")
        expect(response.body).toHaveProperty("token")
        userToken = response.body.token
    })

    let payload: any;
    it("should have a valid token", async () => {
        payload = utils.extract_token_payload(userToken)
        expect(payload).toHaveProperty("id")
        expect(payload).toHaveProperty("name")
        expect(payload).toHaveProperty("email")
    })

    it("should create a task as a logged user", async () => {
        const response = await request.post(`/tasks/user/${payload.id}`)
            .send({
                name: "Test Task",
                description: "Test Description",
                priority: 1,
                points: 10,
                startDate: new Date(),
                endDate: new Date(),
                done: false
            })
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.CREATED)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Task created successfully")
    })

    it("should update a task as a logged user", async () => {
        const response = await request.patch(`/tasks/6`)
            .send({
                name: "Test Task Updated",
                description: "Test Description Updated",
                priority: 1,
                points: 10,
                startDate: new Date(),
                endDate: new Date(),
                done: true
            })
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Task updated successfully")
    })

    it("should delete a task as a logged user", async () => {
        const response = await request.delete(`/tasks/6`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Task deleted successfully")
    })
})