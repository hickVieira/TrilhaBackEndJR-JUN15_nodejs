import supertest from "supertest"
import Database from "../src/database/Database"
import utils from "../src/utils"
import njwt from 'njwt';
import test_utils from "./test_utils"
import { StatusCodes } from "http-status-codes"
import { TaskWithOwnerId } from "../src/models/TaskModels";

describe("Task routes tests", () => {

    let request: supertest.Agent;

    beforeEach(async () => {
        await test_utils.resetDabase()
        request = await test_utils.get_connection();
    })

    it("should get all tasks as a admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
        const response = await request.get("/tasks")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)

        const tasks = response.body as TaskWithOwnerId[]
        expect(tasks).toBeDefined()
        expect(tasks.length).toBeGreaterThan(0)
        expect(tasks[0]).toHaveProperty("owner_id")
        expect(tasks[0]).toHaveProperty("name")
        expect(tasks[0]).toHaveProperty("description")
        expect(tasks[0]).toHaveProperty("priority")
        expect(tasks[0]).toHaveProperty("points")
        expect(tasks[0]).toHaveProperty("startDate")
        expect(tasks[0]).toHaveProperty("endDate")
        expect(tasks[0]).toHaveProperty("done")
    })

    it("should fail to get all tasks as a non-admin", async () => {
        const response = await request.get("/tasks")
        expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should get task by id as a admin", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
        const response = await request.get("/tasks/1")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toHaveProperty("owner_id")
        expect(response.body).toHaveProperty("name")
        expect(response.body).toHaveProperty("description")
        expect(response.body).toHaveProperty("priority")
        expect(response.body).toHaveProperty("points")
        expect(response.body).toHaveProperty("startDate")
        expect(response.body).toHaveProperty("endDate")
        expect(response.body).toHaveProperty("done")
    })

    it("should fail to get task by id as a non-admin", async () => {
        const response = await request.get("/tasks/1")
        expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should get all tasks by user id as a user", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
        const response = await request.get(`/tasks/user/${payload.id}`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body[0]).toHaveProperty("owner_id")
        expect(response.body[0]).toHaveProperty("name")
        expect(response.body[0]).toHaveProperty("description")
        expect(response.body[0]).toHaveProperty("priority")
        expect(response.body[0]).toHaveProperty("points")
        expect(response.body[0]).toHaveProperty("startDate")
        expect(response.body[0]).toHaveProperty("endDate")
        expect(response.body[0]).toHaveProperty("done")
    })

    it("should fail to get all tasks by user id as a non-user", async () => {
        const response = await request.get(`/tasks/user/1`)
        expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("should create a task", async () => {
        const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
        const response = await request.post(`/tasks/user/${payload.id}`).send({
            name: "task name",
            description: "task description",
            priority: 1,
            points: 1,
            startDate: new Date(),
            endDate: new Date(),
            done: false
        })
        expect(response.status).toBe(StatusCodes.CREATED)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Task created successfully")
        expect(response.body).toHaveProperty("task")
        expect(response.body.task).toHaveProperty("id")
        expect(response.body.task).toHaveProperty("owner_id")
        expect(response.body.task).toHaveProperty("name")
        expect(response.body.task).toHaveProperty("description")
        expect(response.body.task).toHaveProperty("priority")
        expect(response.body.task).toHaveProperty("points")
        expect(response.body.task).toHaveProperty("startDate")
        expect(response.body.task).toHaveProperty("endDate")
        expect(response.body.task).toHaveProperty("done")
    })
})