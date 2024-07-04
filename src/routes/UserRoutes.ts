import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { User } from "../models/UserModels"
import { get_all_users } from "../controllers/UserControllers"

export default function routes(fastify: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    fastify.get("/users", get_all_users);
    done();
}