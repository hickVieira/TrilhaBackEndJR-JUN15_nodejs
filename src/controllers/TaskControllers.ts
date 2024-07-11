import { FastifyRequest, FastifyReply } from "fastify"
import { Task } from "../models/TaskModels"
import Database from "../database/Database"

export async function get_all_tasks(request: FastifyRequest, reply: FastifyReply) {
    const db = await Database.get()

    const result = await db.query("SELECT name, description, priority, points, startDate, endDate, done FROM tasks")
    
    reply.send(result[0] as Task[])
}