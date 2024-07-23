import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import utils from "../utils"
import Database from "../database/Database"
import { User, UserWithId } from "../models/UserModels"
import { Task, TaskWithId, TaskWithOwnerId } from "../models/TaskModels"
import { StatusCodes } from "http-status-codes"
import Err from "../Err"

export async function UserAccess(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { authorization } = request.headers

        if (!authorization)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")

        const token = authorization.split(" ")[1] as string
        const jwt = utils.verify_token(token, process.env.JWT_SECRET)

        if (!jwt)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")
    }
    catch (error) {
        utils.reply_error(reply, error);
    }
}

export async function UserAccessUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { authorization } = request.headers

        if (!authorization)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")

        const token = authorization?.split(" ")[1] as string
        const jwt = utils.verify_token(token, process.env.JWT_SECRET)

        if (!jwt)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")

        const payload = jwt.body.toJSON() as any

        const params = request.params as { id: number }

        const db = Database.get_prisma_connection()

        // check if target user exists
        let user: UserWithId = {} as UserWithId
        await db.user
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User not found")

                user = result as UserWithId
            })

        // check if modyfing user is admin
        let isAdmin: boolean = false;
        await db.user
            .findUniqueOrThrow({
                where: {
                    id: Number(payload.id)
                }
            })
            .then((result) => {
                isAdmin = result.isAdmin
            })

        // check if user is owner
        if (!isAdmin)
            if (Number(payload.id) !== Number(user.id))
                throw new Err(StatusCodes.FORBIDDEN, "User does not have permission")
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function UserAccessTask(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { authorization } = request.headers

        if (!authorization)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")

        const token = authorization?.split(" ")[1] as string
        const jwt = utils.verify_token(token, process.env.JWT_SECRET)

        if (!jwt)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")

        const payload = jwt.body.toJSON() as any
        
        const params = request.params as { id: number }
        
        const db = Database.get_prisma_connection()

        // check if target task exists
        let task: TaskWithOwnerId = {} as TaskWithOwnerId
        await db.task
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "Task not found")

                task = result as TaskWithOwnerId
            })

        // check if modyfing user is admin
        let isAdmin: boolean = false;
        await db.user
            .findUniqueOrThrow({
                where: {
                    id: Number(payload.id)
                }
            })
            .then((result) => {
                isAdmin = result.isAdmin
            })

        // check if user is owner
        if (!isAdmin)
            if (Number(payload.id) !== Number(task.ownerId))
                throw new Err(StatusCodes.FORBIDDEN, "User does not have permission")
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function AdminAccess(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { authorization } = request.headers

        if (!authorization)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")

        const token = authorization.split(" ")[1] as string
        const jwt = utils.verify_token(token, process.env.JWT_SECRET)

        if (!jwt)
            throw new Err(StatusCodes.UNAUTHORIZED, "User does not have permission")

        const payload = jwt.body.toJSON() as any

        const db = Database.get_prisma_connection()

        // check if user is admin
        let isAdmin: boolean = false;
        await db.user
            .findUniqueOrThrow({
                where: {
                    id: Number(payload.id)
                }
            })
            .then((result) => {
                isAdmin = result.isAdmin
            })

        if (!isAdmin)
            throw new Err(StatusCodes.FORBIDDEN, "User does not have permission")

    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}
