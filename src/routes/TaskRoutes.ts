import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { get_all_tasks, get_task_by_id, get_all_tasks_by_user_id, create_task } from "../controllers/TaskControllers"
import { AdminAuth, UserAuth } from "../middlewares/AuthMiddleware";

export default function routes(fastify: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    fastify.get("/tasks", { preHandler: AdminAuth }, get_all_tasks);
    fastify.get("/tasks/:id", { preHandler: AdminAuth }, get_task_by_id);
    fastify.get("/tasks/user/:id", { preHandler: UserAuth }, get_all_tasks_by_user_id);
    fastify.post("/tasks/user/:id", { preHandler: UserAuth }, create_task);
    done();
}