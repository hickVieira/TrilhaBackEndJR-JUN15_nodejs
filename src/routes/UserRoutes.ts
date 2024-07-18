import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { get_all_users, get_user_by_id, post_user as register_user, login_user, put_user, patch_user, delete_user } from "../controllers/UserControllers"
import { AdminAccess, UserAccess, UserAccessUser } from "../middlewares/AuthMiddleware";

export default function routes(instance: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    instance.get("/users", { preHandler: AdminAccess }, get_all_users);
    instance.get("/users/:id", { preHandler: AdminAccess }, get_user_by_id);
    instance.post("/register", register_user);
    instance.post("/login", login_user);
    instance.put("/users/:id", { preHandler: AdminAccess }, put_user);
    instance.patch("/users/:id", { preHandler: UserAccessUser }, patch_user);
    instance.delete("/users/:id", { preHandler: AdminAccess }, delete_user);
    done();
}