import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { get_all_tasks } from "../controllers/TaskControllers"

export default function routes(fastify: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    fastify.get("/tasks", get_all_tasks);
    done();
}