import { FastifyInstance, HookHandlerDoneFunction } from "fastify"
import { get_all_tasks, get_task_by_id, get_all_tasks_by_user_id, post_task, put_task, patch_task, delete_task } from "../controllers/TaskControllers"
import { AdminAccess, UserAccess, UserAccessTask } from "../middlewares/AuthMiddleware";

export default function routes(instance: FastifyInstance, options: any, done: HookHandlerDoneFunction) {
    instance.get("/tasks", { preHandler: AdminAccess }, get_all_tasks);
    instance.get("/tasks/:id", { preHandler: AdminAccess }, get_task_by_id);
    instance.get("/tasks/user/:id", { preHandler: UserAccess }, get_all_tasks_by_user_id);
    instance.post("/tasks/user/:id", { preHandler: UserAccess }, post_task);
    instance.put("/tasks/:id", { preHandler: AdminAccess }, put_task);
    instance.patch("/tasks/:id", { preHandler: UserAccessTask }, patch_task);
    instance.delete("/tasks/:id", { preHandler: UserAccessTask }, delete_task);
    done();
}