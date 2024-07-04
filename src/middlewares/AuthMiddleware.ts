import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import HttpStatusCodes from "http-status-codes"

export default function AuthMiddleware(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    const { authorization } = request.headers

    if (!authorization) {
        reply.status(HttpStatusCodes.UNAUTHORIZED).send({
            error: "Unauthorized"
        })
        return;
    }

    const token = authorization.split(" ")[1]
    // const user = 


}