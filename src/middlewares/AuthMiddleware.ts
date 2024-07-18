import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import utils from "../utils"
import Database from "../database/Database"
import { User } from "../models/UserModels"
import { Task, TaskWithId, TaskWithOwnerId } from "../models/TaskModels"
import { StatusCodes } from "http-status-codes"

export async function UserAccess(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    const token = authorization.split(" ")[1] as string
    const jwt = utils.verify_token(token, process.env.JWT_SECRET)

    if (!jwt) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    const payload = jwt.body.toJSON() as any
}

export async function UserAccessTask(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    const token = authorization?.split(" ")[1] as string
    const jwt = utils.verify_token(token, process.env.JWT_SECRET)

    if (!jwt) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    try {
        const db = await Database.get()
        const params = request.params as { id: number }

        const payload = jwt.body.toJSON() as any

        // check if task exists
        await db.query("SELECT id FROM tasks WHERE id = ?", [params.id])
            .then((result) => {
                const tasks = result[0] as TaskWithId[]
                if (tasks.length === 0) {
                    reply.status(StatusCodes.NOT_FOUND).send({
                        message: "Task not found"
                    })
                    return
                }
            })

        // get task
        let task: TaskWithOwnerId = {} as TaskWithOwnerId
        await db.query("SELECT owner_id FROM tasks WHERE id = ?", [params.id])
            .then((result) => {
                const tasks = result[0] as TaskWithOwnerId[]
                task = tasks[0] as TaskWithOwnerId
            })
            .catch((error) => {
                reply.status(StatusCodes.NOT_FOUND).send({
                    message: "Task not found"
                })
                return
            })

        // check if user is admin
        let isAdmin: boolean = false;
        try {
            const db = await Database.get()

            // check if is admin
            await db.query("SELECT isAdmin FROM users WHERE id = ?", [payload.id])
                .then((result) => {
                    const bools = result[0] as any
                    if (bools.length > 0)
                        isAdmin = bools[0].isAdmin == 1 ? true : false
                })
        }
        catch (error) {
            reply.status(StatusCodes.FORBIDDEN).send({
                message: "User does not have permission"
            })
            return
        }

        // check if user is owner
        if (!isAdmin)
            if (Number(payload.id) !== Number(task.owner_id)) {
                reply.status(StatusCodes.FORBIDDEN).send({
                    message: "User does not have permission"
                })
                return;
            }
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Internal server error"
        })
    }
}

export async function AdminAccess(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    const token = authorization.split(" ")[1] as string
    const jwt = utils.verify_token(token, process.env.JWT_SECRET)

    if (!jwt) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    const payload = jwt.body.toJSON() as any

    // check if user is admin
    let isAdmin: boolean = false;
    try {
        const db = await Database.get()

        // check if is admin
        await db.query("SELECT isAdmin FROM users WHERE id = ?", [payload.id])
            .then((result) => {
                const bools = result[0] as any
                if (bools.length > 0)
                    isAdmin = bools[0].isAdmin == 1 ? true : false
            })
    }
    catch (error) {
        reply.status(StatusCodes.FORBIDDEN).send({
            message: "User does not have permission"
        })
        return
    }

    if (!isAdmin) {
        reply.status(StatusCodes.FORBIDDEN).send({
            message: "User does not have permission"
        })
        return
    }
}
