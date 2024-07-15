import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import StatusCodes from "http-status-codes"
import utils from "../utils"
import Database from "../database/Database"
import { User } from "../models/UserModels"

export async function UserAuth(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
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
}

export async function AdminAuth(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
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

    let isAdmin: boolean = false;
    try {
        const db = await Database.get()

        // check if is admin
        await db.query("SELECT isAdmin FROM users WHERE id = ?", [payload.id])
            .then((result) => {
                const bools = result[0] as unknown as boolean[]
                if (bools.length > 0)
                    isAdmin = bools[0] as boolean
                else
                    reply.status(StatusCodes.UNAUTHORIZED).send({
                        message: "User does not have permission"
                    })
            })
    }
    catch (error) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
    }

    if (!isAdmin) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
    }
}
