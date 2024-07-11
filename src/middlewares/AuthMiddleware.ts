import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import StatusCodes from "http-status-codes"

export function AdminAuth(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    const { authorization } = request.headers

    if (!authorization) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    const token = authorization.split(" ")[1]
    // const user = 
}

export function UserAuth(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    const { authorization } = request.headers

    if (!authorization) {
        reply.status(StatusCodes.UNAUTHORIZED).send({
            message: "User does not have permission"
        })
        return;
    }

    const token = authorization.split(" ")[1]
    // const user = 
}
