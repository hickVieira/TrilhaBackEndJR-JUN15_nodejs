import { FastifyRequest, FastifyReply } from "fastify"
import { StatusCodes } from "http-status-codes"
import { Task, TaskWithOwnerId } from "../models/TaskModels"
import Database from "../database/Database"
import utils from "../utils"
import Err from "../Err"

export async function get_all_tasks(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get all tasks
        await db.task
            .findMany()
            .then((result) => {
                reply.status(StatusCodes.OK).send(result as Task[])
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function get_task_by_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // get task
        await db.task
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "Task does not exist")

                reply.status(StatusCodes.OK).send(result as TaskWithOwnerId)
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function get_all_tasks_by_user_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // get all tasks by user id
        await db.task
            .findMany({
                where: {
                    ownerId: Number(params.id)
                }
            })
            .then((result) => {
                reply.status(StatusCodes.OK).send(result as Task[])
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function post_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // get new task object
        const task = request.body as Task

        // insert task
        await db.task
            .create({
                data: {
                    ownerId: Number(params.id),
                    name: task.name,
                    description: task.description,
                    priority: task.priority,
                    points: task.points,
                    startDate: task.startDate,
                    endDate: task.endDate,
                    done: task.done
                }
            })
            .then((result) => {
                utils.reply_success(reply, StatusCodes.CREATED, "Task created successfully")
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function put_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // get new info
        const newInfo = request.body as TaskWithOwnerId

        // get task
        let task: TaskWithOwnerId = {} as TaskWithOwnerId
        await db.task
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "Task does not exist")

                task = result as TaskWithOwnerId
            })

        // assign data
        task.ownerId = newInfo.ownerId ?? task.ownerId
        task.name = newInfo.name ?? task.name
        task.description = newInfo.description ?? task.description
        task.priority = newInfo.priority ?? task.priority
        task.points = newInfo.points ?? task.points
        task.startDate = newInfo.startDate ?? task.startDate
        task.endDate = newInfo.endDate ?? task.endDate
        task.done = newInfo.done ?? task.done

        // update task
        await db.task
            .update({
                where: {
                    id: Number(params.id)
                },
                data: task
            })
            .then((result) => {
                utils.reply_success(reply, StatusCodes.OK, "Task updated successfully")
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function patch_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // get new info
        const newInfo = request.body as Task

        // get task
        let task: Task = {} as Task
        await db.task
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "Task does not exist")

                task = result as Task
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
        await db.task
            .update({
                where: {
                    id: Number(params.id)
                },
                data: task
            })
            .then((result) => {
                utils.reply_success(reply, StatusCodes.OK, "Task updated successfully")
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function delete_task(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // delete task
        await db.task
            .delete({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                utils.reply_success(reply, StatusCodes.OK, "Task deleted successfully")
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}
