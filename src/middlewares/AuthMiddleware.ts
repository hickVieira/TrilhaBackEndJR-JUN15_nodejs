import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import utils from "../utils"
import Database from "../database/Database"
import { User, UserWithId } from "../models/UserModels"
import { Task, TaskWithId, TaskWithOwnerId } from "../models/TaskModels"
import { StatusCodes } from "http-status-codes"

export async function UserAccess(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    const token = authorization.split(" ")[1] as string
    const jwt = utils.verify_token(token, process.env.JWT_SECRET)

    if (!jwt) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    const payload = jwt.body.toJSON() as any
}

export async function UserAccessUser(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    const token = authorization?.split(" ")[1] as string
    const jwt = utils.verify_token(token, process.env.JWT_SECRET)

    if (!jwt) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        const payload = jwt.body.toJSON() as any

        // check if target user exists
        let user: UserWithId = {} as UserWithId
        try {
            await db.user
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    if (result == null)
                        throw new Error("User not found")

                    user = result as UserWithId
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.NOT_FOUND, "User not found", error)
            return
        }

        // check if modyfing user is admin
        let isAdmin: boolean = false;
        try {

            await db.user
                .findUniqueOrThrow({
                    where: {
                        id: Number(payload.id)
                    }
                })
                .then((result) => {
                    isAdmin = result.isAdmin
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", error)
            return
        }

        // check if user is owner
        if (!isAdmin)
            if (Number(payload.id) !== Number(user.id)) {
                utils.reply_error(reply, StatusCodes.FORBIDDEN, "User does not have permission")
                return;
            }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", error)
        return
    }
}

export async function UserAccessTask(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    const token = authorization?.split(" ")[1] as string
    const jwt = utils.verify_token(token, process.env.JWT_SECRET)

    if (!jwt) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        const payload = jwt.body.toJSON() as any

        // check if target task exists
        let task: TaskWithOwnerId = {} as TaskWithOwnerId
        try {
            await db.task
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    if (result == null)
                        throw new Error("Task not found")

                    task = result as TaskWithOwnerId
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.NOT_FOUND, "Task not found", error)
            return
        }

        // check if modyfing user is admin
        let isAdmin: boolean = false;
        try {
            await db.user
                .findUniqueOrThrow({
                    where: {
                        id: Number(payload.id)
                    }
                })
                .then((result) => {
                    isAdmin = result.isAdmin
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", error)
            return
        }

        // check if user is owner
        if (!isAdmin)
            if (Number(payload.id) !== Number(task.ownerId)) {
                utils.reply_error(reply, StatusCodes.FORBIDDEN, "User does not have permission")
                return;
            }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", error)
        return
    }
}

export async function AdminAccess(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    const token = authorization.split(" ")[1] as string
    const jwt = utils.verify_token(token, process.env.JWT_SECRET)

    if (!jwt) {
        utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "User does not have permission")
        return;
    }

    const payload = jwt.body.toJSON() as any

    try {
        const db = Database.get_prisma_connection()

        // check if user is admin
        let isAdmin: boolean = false;
        try {
            await db.user
                .findUniqueOrThrow({
                    where: {
                        id: Number(payload.id)
                    }
                })
                .then((result) => {
                    isAdmin = result.isAdmin
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", error)
            return
        }

        if (!isAdmin) {
            utils.reply_error(reply, StatusCodes.FORBIDDEN, "User does not have permission")
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", error)
        return
    }
}
