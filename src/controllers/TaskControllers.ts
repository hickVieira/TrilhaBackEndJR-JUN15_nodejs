import { FastifyRequest, FastifyReply } from "fastify"
import { Task, TaskWithOwnerId } from "../models/TaskModels"
import Database from "../database/Database"
import { StatusCodes } from "http-status-codes"
import utils from "../utils"

export async function get_all_tasks(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        await db.query("SELECT owner_id, name, description, priority, points, startDate, endDate, done FROM tasks")
            .then((result) => {
                const tasks = result[0] as TaskWithOwnerId[]
                reply.status(StatusCodes.OK).send(tasks as TaskWithOwnerId[])
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function get_task_by_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const params = request.params as { id: number }

        await db.query("SELECT owner_id, name, description, priority, points, startDate, endDate, done FROM tasks WHERE id = ?", [params.id])
            .then((result) => {
                const tasks = result[0] as TaskWithOwnerId[]
                reply.status(StatusCodes.OK).send(tasks[0] as TaskWithOwnerId)
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function get_all_tasks_by_user_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const params = request.params as { id: number }

        await db.query("SELECT owner_id, name, description, priority, points, startDate, endDate, done FROM tasks WHERE owner_id = ?", [params.id])
            .then((result) => {
                const tasks = result[0] as TaskWithOwnerId[]
                reply.status(StatusCodes.OK).send(tasks as TaskWithOwnerId[])
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function create_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const params = request.params as { id: number }
        const task = request.body as Task

        await db.query("INSERT INTO tasks (owner_id, name, description, priority, points, startDate, endDate, done) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [Number(params.id), task.name, task.description, task.priority, task.points, utils.format_date_to_sql(task.startDate), utils.format_date_to_sql(task.endDate), task.done])
            .then((result) => {
                reply.status(StatusCodes.CREATED).send({
                    message: "Task created successfully",
                })
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}