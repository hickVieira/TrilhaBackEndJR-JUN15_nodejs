import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { get_all_users, get_user_by_id, create_user, login_user, put_user, delete_user } from "../controllers/UserControllers"
import { AdminAuth } from "../middlewares/AuthMiddleware";

export default function routes(fastify: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    // fastify.get("/users", { preHandler: AdminAuth }, get_all_users);
    fastify.get("/users", get_all_users);
    fastify.get("/users/:id", get_user_by_id);
    fastify.post("/users", create_user);
    fastify.post("/login", login_user);
    fastify.put("/users/:id", put_user);
    fastify.delete("/users/:id", delete_user);
    done();
}