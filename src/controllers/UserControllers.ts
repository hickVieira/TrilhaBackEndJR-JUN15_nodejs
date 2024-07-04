import { FastifyRequest, FastifyReply } from "fastify"
import { User } from "../models/UserModels"
import { getDatabase, resetDatabase } from "../database/Database";

export async function get_all_users(request: FastifyRequest, reply: FastifyReply) {
    const db = await getDatabase();

    const users1 = await db.run("SELECT * FROM users");
    const users2 = await db.all("SELECT * FROM users");
    const users3 = await db.get("SELECT * FROM users");

    console.log(users1);
    console.log(users2);
    console.log(users3);

    reply.send(users1)
    reply.send(users2)
    reply.send(users3)
}