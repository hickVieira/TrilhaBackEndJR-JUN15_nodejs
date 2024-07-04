import { FastifyRequest, FastifyReply } from "fastify"
import { User } from "../models/UserModels"
import Database from "../database/Database"

export async function get_all_users(request: FastifyRequest, reply: FastifyReply) {
    const db = await Database.get()

    db.execute("SELECT * FROM users")
        .then((result) => {
            reply.send(result)
        })
        .catch((err) => {
            reply.send(err)
        })
}