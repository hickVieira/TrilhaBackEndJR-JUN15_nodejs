import fastify, { FastifyRequest, FastifyReply } from "fastify"
import { Task, TaskWithOwnerId } from "../models/TaskModels"
import Database from "../database/Database"
import { StatusCodes } from "http-status-codes"
import utils from "../utils"
import njwt from "njwt"

export async function get_all_tasks(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        await db.query("SELECT owner_id, name, description, priority, points, startDate, endDate, done FROM tasks")
            .then((result) => {
                const tasks = result[0] as TaskWithOwnerId[]
                reply.status(StatusCodes.OK).send(tasks as TaskWithOwnerId[])
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to get tasks"
        })
        console.error(error)
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
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Task not found"
        })
        console.error(error)
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
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to get tasks"
        })
        console.error(error)
    }
}

export async function post_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const params = request.params as { id: number }
        const task = request.body as Task

        await db.query("INSERT INTO tasks (owner_id, name, description, priority, points, startDate, endDate, done) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [params.id, task.name, task.description, task.priority, task.points, utils.format_date_to_sql(task.startDate), utils.format_date_to_sql(task.endDate), task.done])
            .then((result) => {
                reply.status(StatusCodes.CREATED).send({
                    message: "Task created successfully",
                })
            })
            .catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to create task"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to create task"
        })
        console.error(error)
    }
}

export async function put_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const newInfo = request.body as TaskWithOwnerId
        const params = request.params as { id: number }

        // get task
        let task: TaskWithOwnerId = {} as TaskWithOwnerId
        await db.query("SELECT owner_id, name, description, priority, points, startDate, endDate, done FROM tasks WHERE id = ?", [params.id])
            .then((result) => {
                const tasks = result[0] as TaskWithOwnerId[]
                task = tasks[0] as TaskWithOwnerId
            })
            .catch((error) => {
                reply.status(StatusCodes.NOT_FOUND).send({
                    message: "Task not found"
                })
                console.error(error)
            })

        // assign data
        task.owner_id = newInfo.owner_id ?? task.owner_id
        task.name = newInfo.name ?? task.name
        task.description = newInfo.description ?? task.description
        task.priority = newInfo.priority ?? task.priority
        task.points = newInfo.points ?? task.points
        task.startDate = newInfo.startDate ?? task.startDate
        task.endDate = newInfo.endDate ?? task.endDate
        task.done = newInfo.done ?? task.done

        // update task
        await db.query("UPDATE tasks SET owner_id = ?, name = ?, description = ?, priority = ?, points = ?, startDate = ?, endDate = ?, done = ? WHERE id = ?",
            [task.owner_id, task.name, task.description, task.priority, task.points, utils.format_date_to_sql(task.startDate), utils.format_date_to_sql(task.endDate), task.done, params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "Task updated successfully",
                })
            })
            .catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to update task"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to update task"
        })
        console.error(error)
    }
}

export async function patch_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const newInfo = request.body as Task
        const params = request.params as { id: number }

        // get task
        let task: Task = {} as Task
        await db.query("SELECT name, description, priority, points, startDate, endDate, done FROM tasks WHERE id = ?", [params.id])
            .then((result) => {
                const tasks = result[0] as Task[]
                task = tasks[0] as Task
            })
            .catch((error) => {
                reply.status(StatusCodes.NOT_FOUND).send({
                    message: "Task not found"
                })
                console.error(error)
            })

        // assign data
        task.name = newInfo.name ?? task.name
        task.description = newInfo.description ?? task.description
        task.priority = newInfo.priority ?? task.priority
        task.points = newInfo.points ?? task.points
        task.startDate = newInfo.startDate ?? task.startDate
        task.endDate = newInfo.endDate ?? task.endDate
        task.done = newInfo.done ?? task.done

        // update task
        await db.query("UPDATE tasks SET name = ?, description = ?, priority = ?, points = ?, startDate = ?, endDate = ?, done = ? WHERE id = ?",
            [task.name, task.description, task.priority, task.points, utils.format_date_to_sql(task.startDate), utils.format_date_to_sql(task.endDate), task.done, params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "Task updated successfully",
                })
            })
            .catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to update task"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to update task"
        })
        console.error(error)
    }
}

export async function delete_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const params = request.params as { id: number }

        await db.query("DELETE FROM tasks WHERE id = ?", [params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "Task deleted successfully",
                })
            })
            .catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to delete task"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to delete task"
        })
        console.error(error)
    }
}
