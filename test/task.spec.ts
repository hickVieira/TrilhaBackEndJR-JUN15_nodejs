// import supertest from "supertest"
// import test_utils from "./test_utils"
// import { StatusCodes } from "http-status-codes"

// describe("Task routes tests", () => {

//     let request: supertest.Agent;

//     beforeAll(async () => {
//         request = await test_utils.get_connection();
//     })

//     beforeEach(async () => {
//         await test_utils.resetDabase()
//     })

//     it("should get all tasks as a admin", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
//         const response = await request.get("/tasks")
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.OK)

//         expect(response.body).toBeDefined()
//         expect(response.body.length).toBeGreaterThan(0)
//         expect(response.body[0]).toHaveProperty("owner_id")
//         expect(response.body[0]).toHaveProperty("name")
//         expect(response.body[0]).toHaveProperty("description")
//         expect(response.body[0]).toHaveProperty("priority")
//         expect(response.body[0]).toHaveProperty("points")
//         expect(response.body[0]).toHaveProperty("startDate")
//         expect(response.body[0]).toHaveProperty("endDate")
//         expect(response.body[0]).toHaveProperty("done")
//     })

//     it("should fail to get all tasks as a non-admin", async () => {
//         const response = await request.get("/tasks")
//         expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
//     })

//     it("should get task by id as a admin", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
//         const response = await request.get("/tasks/1")
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.OK)
//         expect(response.body).toHaveProperty("owner_id")
//         expect(response.body).toHaveProperty("name")
//         expect(response.body).toHaveProperty("description")
//         expect(response.body).toHaveProperty("priority")
//         expect(response.body).toHaveProperty("points")
//         expect(response.body).toHaveProperty("startDate")
//         expect(response.body).toHaveProperty("endDate")
//         expect(response.body).toHaveProperty("done")
//     })

//     it("should fail to get task by id as a non-admin", async () => {
//         const response = await request.get("/tasks/1")
//         expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
//     })

//     it("should get all tasks by user id as a user", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
//         const response = await request.get(`/tasks/user/${payload.id}`)
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.OK)
//         expect(response.body).toBeInstanceOf(Array)
//         expect(response.body.length).toBeGreaterThan(0)
//         expect(response.body[0]).toHaveProperty("owner_id")
//         expect(response.body[0]).toHaveProperty("name")
//         expect(response.body[0]).toHaveProperty("description")
//         expect(response.body[0]).toHaveProperty("priority")
//         expect(response.body[0]).toHaveProperty("points")
//         expect(response.body[0]).toHaveProperty("startDate")
//         expect(response.body[0]).toHaveProperty("endDate")
//         expect(response.body[0]).toHaveProperty("done")
//     })

//     it("should fail to get all tasks by user id as a non-user", async () => {
//         const response = await request.get(`/tasks/user/1`)
//         expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
//     })

//     it("should post a task as a user", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
//         const response = await request.post(`/tasks/user/${payload.id}`)
//             .send({
//                 name: "task name",
//                 description: "task description",
//                 priority: 1,
//                 points: 1,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 done: false
//             })
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.CREATED)
//         expect(response.body).toHaveProperty("message")
//         expect(response.body.message).toBe("Task created successfully")
//     })

//     it("should fail to post a task as a non-user", async () => {
//         const response = await request.post("/tasks/user/1")
//             .send({
//                 name: "task name",
//                 description: "task description",
//                 priority: 1,
//                 points: 1,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 done: false
//             })
//         expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
//     })

//     it("should put a task as a admin", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
//         const response = await request.put("/tasks/1")
//             .send({
//                 owner_id: 2,
//                 name: "task name",
//                 description: "task description",
//                 priority: 1,
//                 points: 1,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 done: false
//             })
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.OK)
//         expect(response.body).toHaveProperty("message")
//         expect(response.body.message).toBe("Task updated successfully")
//     })

//     it("should fail to put a task as a non-admin", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "jane@example.com", "qwerty123")
//         const response = await request.put("/tasks/1")
//             .send({
//                 owner_id: 2,
//                 name: "task name",
//                 description: "task description",
//                 priority: 1,
//                 points: 1,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 done: false
//             })
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.FORBIDDEN)
//     })

//     it("should patch a task as a user", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
//         const response = await request.patch("/tasks/1")
//             .send({
//                 name: "new task name",
//                 description: "new task description",
//                 priority: 1,
//                 points: 1,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 done: false
//             })
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.OK)
//         expect(response.body).toHaveProperty("message")
//         expect(response.body.message).toBe("Task updated successfully")
//     })

//     it("should fail to patch a task not belonging to the user", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "jane@example.com", "qwerty123")
//         const response = await request.patch("/tasks/1")
//             .send({
//                 name: "new task name",
//                 description: "new task description",
//                 priority: 1,
//                 points: 1,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 done: false
//             })
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.FORBIDDEN)
//     })

//     it("should delete a task as a admin", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "john@example.com", "password123")
//         const response = await request.delete("/tasks/2")
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.OK)
//         expect(response.body).toHaveProperty("message")
//         expect(response.body.message).toBe("Task deleted successfully")
//     })

//     it("should fail to delete a task not belonging to the user", async () => {
//         const [payload, userToken] = await test_utils.login_user(request, "jane@example.com", "qwerty123")
//         const response = await request.delete("/tasks/1")
//             .set("Authorization", `Bearer ${userToken}`)
//         expect(response.status).toBe(StatusCodes.FORBIDDEN)
//     })

//     it("should fail to delete a task as a non-user", async () => {
//         const response = await request.delete("/tasks/1")
//         expect(response.status).toBe(StatusCodes.UNAUTHORIZED)
//     })
// })