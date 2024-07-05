import { FastifyRequest, FastifyReply } from "fastify"
import { User } from "../models/UserModels"
import Database from "../database/Database"

export async function get_all_users(request: FastifyRequest, reply: FastifyReply) {
    const db = await Database.get()

    const result = await db.query("SELECT name, email, password FROM users")
    
    reply.send(result[0] as User[])
}