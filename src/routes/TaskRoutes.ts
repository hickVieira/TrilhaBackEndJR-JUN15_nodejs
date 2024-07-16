import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { get_all_tasks, get_task_by_id, get_all_tasks_by_user_id, create_task } from "../controllers/TaskControllers"

export default function routes(fastify: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    fastify.get("/tasks", get_all_tasks);
    fastify.get("/tasks/:id", get_task_by_id);
    fastify.get("/tasks/user/:id", get_all_tasks_by_user_id);
    fastify.post("/tasks/user/:id", create_task);
    done();
}