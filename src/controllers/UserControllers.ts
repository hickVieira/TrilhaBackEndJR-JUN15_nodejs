import { FastifyRequest, FastifyReply } from "fastify"
import { StatusCodes } from "http-status-codes"
import { User, UserWithId } from "../models/UserModels"
import Database from "../database/Database"
import utils from "../utils"

export async function get_all_users(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        await db.query("SELECT name, email, password, isAdmin FROM users")
            .then((result) => {
                if (result[0])
                    reply.status(StatusCodes.OK).send(result[0] as User[])

                reply.status(StatusCodes.OK).send(result[0] as User[])
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function get_user_by_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const params = request.params as { id: number }

        await db.query("SELECT name, email, password, isAdmin FROM users WHERE id = ?", [params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send((result[0] as User[])[0])
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function create_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        // get user
        const user = request.body as User

        // check if user exists
        await db.query("SELECT email FROM users WHERE email = ?", [user.email])
            .then((result) => {
                const users = result[0] as User[]
                if (users.length > 1) {
                    reply.status(StatusCodes.CONFLICT).send({
                        message: "User already exists"
                    })
                    return;
                }
            })

        // else insert

        await db.query("INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)", [user.name, user.email, user.password, user.isAdmin])
            .then((result) => {
                reply.status(StatusCodes.CREATED).send({
                    message: "User created",
                    user: (result[0] as User[])[0],
                })
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function login_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        // get user
        const loginData = request.body as { email: string, password: string }

        // check if user exists
        await db.query("SELECT id, name, email, password, isAdmin FROM users WHERE email = ?", [loginData.email])
            .then((result) => {
                const users = result[0] as UserWithId[]
                if (users.length > 1) {
                    reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                        message: "Critical error: Multiple users found with same email... contact support"
                    })
                    return;
                }

                // get user
                const user = users[0] as UserWithId

                // check password
                if (user.password != loginData.password) {
                    reply.status(StatusCodes.UNAUTHORIZED).send({
                        message: "Wrong password"
                    })
                    return;
                }

                // create token
                const token = utils.create_token({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, 4)

                reply.status(StatusCodes.OK).send({
                    message: "Successful login",
                    token: token.compact(),
                })
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function put_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const newInfo = request.body as { name: string, email: string, password: string, isAdmin: boolean }

        // check if email already exists
        await db.query("SELECT email FROM users WHERE email = ?", [newInfo.email])
            .then((result) => {
                const users = result[0] as User[]
                if (users.length > 1) {
                    reply.status(StatusCodes.CONFLICT).send({
                        message: "Email already exists in database"
                    })
                    return;
                }
            })

        const params = request.params as { id: number }

        // get user
        let user: UserWithId = {} as UserWithId;
        await db.query("SELECT id, name, email, password, isAdmin FROM users WHERE id = ?", [params.id])
            .then((result) => {
                const users = result[0] as UserWithId[]
                user = users[0] as UserWithId

                // assign data
                user.name = newInfo.name ?? user.name
                user.email = newInfo.email ?? user.email
                user.password = newInfo.password ?? user.password
            })
            .catch((error) => {
                reply.status(StatusCodes.NOT_FOUND).send({
                    message: "User not found"
                })
                return
            })

        // else update
        await db.query("UPDATE users SET name = ?, email = ?, password = ?, isAdmin = ? WHERE id = ?", [user.name, user.email, user.password, user.isAdmin, params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "User updated"
                })
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


export async function patch_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const newInfo = request.body as { name: string, email: string, password: string }

        // check if email already exists
        await db.query("SELECT email FROM users WHERE email = ?", [newInfo.email])
            .then((result) => {
                const users = result[0] as User[]
                if (users.length > 1) {
                    reply.status(StatusCodes.CONFLICT).send({
                        message: "Email already exists in database"
                    })
                    return;
                }
            })

        const params = request.params as { id: number }

        // get user
        let user: User = {} as User;
        await db.query("SELECT name, email, password, isAdmin FROM users WHERE id = ?", [params.id])
            .then((result) => {
                const users = result[0] as User[]
                user = users[0] as User

                // assign data
                user.name = newInfo.name ?? user.name
                user.email = newInfo.email ?? user.email
                user.password = newInfo.password ?? user.password
            })
            .catch((error) => {
                reply.status(StatusCodes.NOT_FOUND).send({
                    message: "User not found"
                })
                return
            })

        // else update
        await db.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [user.name, user.email, user.password, params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "User updated"
                })
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export async function delete_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get()

        const params = request.params as { id: number }

        await db.query("DELETE FROM users WHERE id = ?", [params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "User deleted"
                })
                return
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}