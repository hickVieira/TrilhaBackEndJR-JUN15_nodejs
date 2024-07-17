import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { get_all_users, get_user_by_id, post_user, login_user, put_user, patch_user, delete_user } from "../controllers/UserControllers"
import { AdminAuth, UserAuth } from "../middlewares/AuthMiddleware";

export default function routes(fastify: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    fastify.get("/users", { preHandler: AdminAuth }, get_all_users);
    fastify.get("/users/:id", { preHandler: AdminAuth }, get_user_by_id);
    fastify.post("/users", post_user);
    fastify.post("/login", login_user);
    fastify.put("/users/:id", { preHandler: AdminAuth }, put_user);
    fastify.patch("/users/:id", { preHandler: UserAuth }, patch_user);
    fastify.delete("/users/:id", { preHandler: AdminAuth }, delete_user);
    done();
}