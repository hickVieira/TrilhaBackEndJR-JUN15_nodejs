import { FastifyRequest, FastifyReply } from "fastify"
import { StatusCodes } from "http-status-codes"
import { User, UserWithId } from "../models/UserModels"
import Database from "../database/Database"
import utils from "../utils"

export async function get_all_users(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get all users
        await db.user
            .findMany()
            .then((result) => {
                reply.status(StatusCodes.OK).send(result.map((user) => { return user as User }))
            })
            .catch((error) => {
                utils.emit_error(reply, error, "Failed to get all users")
            })
    }
    catch (error) {
        utils.emit_error(reply, error, "Failed to get all users")
    }
}

export async function get_user_by_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get_internal()

        const params = request.params as { id: number }

        await db.query("SELECT name, email, password, isAdmin FROM users WHERE id = ?", [params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send((result[0] as User[])[0])
            })
    }
    catch (error) {
        utils.emit_error(reply, error, "Failed to get user by id")
    }
}

export async function register_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get_internal()

        // get user
        const user = request.body as User

        // check if user exists
        await db.query("SELECT email FROM users WHERE email = ?", [user.email])
            .then((result) => {
                const users = result[0] as User[]
                if (users.length > 0)
                    throw new Error("User already exists")
            }).catch((error) => {
                reply.status(StatusCodes.CONFLICT).send({
                    message: "User already exists"
                })
                console.error(error)
            })

        // else insert

        await db.query("INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)", [user.name, user.email, user.password, false])
            .catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to create user"
                })
                console.error(error)
            })

        // get user
        await db.query("SELECT id, name, email, password, isAdmin FROM users WHERE email = ?", [user.email])
            .then((result) => {
                const users = result[0] as UserWithId[]
                const user = users[0] as UserWithId

                // create token
                const token = utils.create_token({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, 4)

                reply.status(StatusCodes.CREATED).send({
                    message: "User created successfully",
                    token: token.compact(),
                })
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to create user"
        })
        console.error(error)
    }
}

export async function login_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get_internal()

        // get user
        const loginData = request.body as { email: string, password: string }

        // check if user exists
        await db.query("SELECT id, name, email, password, isAdmin FROM users WHERE email = ?", [loginData.email])
            .then((result) => {
                const users = result[0] as UserWithId[]
                if (users.length > 1)
                    throw new Error("User already exists")

                // get user
                const user = users[0] as UserWithId

                // check password
                if (user.password != loginData.password)
                    throw new Error("Wrong password")

                // create token
                const token = utils.create_token({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, 4)

                reply.status(StatusCodes.OK).send({
                    message: "User logged in successfully",
                    token: token.compact(),
                })
            })
            .catch((error) => {
                reply.status(StatusCodes.UNAUTHORIZED).send({
                    message: "User does not exist"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to login user"
        })
        console.error(error)
    }
}

export async function put_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get_internal()

        const newInfo = request.body as { name: string, email: string, password: string, isAdmin: boolean }

        // check if email already exists
        await db.query("SELECT email FROM users WHERE email = ?", [newInfo.email])
            .then((result) => {
                const users = result[0] as User[]
                if (users.length > 1)
                    throw new Error("User already exists")
            })
            .catch((error) => {
                reply.status(StatusCodes.CONFLICT).send({
                    message: "User already exists"
                })
                console.error(error)
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
            })

        // update user
        await db.query("UPDATE users SET name = ?, email = ?, password = ?, isAdmin = ? WHERE id = ?", [user.name, user.email, user.password, user.isAdmin, params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "User updated"
                })
            }).catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to update user"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to update user"
        })
        console.error(error)
    }
}


export async function patch_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get_internal()

        const newInfo = request.body as { name: string, email: string, password: string }

        // check if email already exists
        await db.query("SELECT email FROM users WHERE email = ?", [newInfo.email])
            .then((result) => {
                const users = result[0] as User[]
                if (users.length > 1)
                    throw new Error("User already exists")
            })
            .catch((error) => {
                reply.status(StatusCodes.CONFLICT).send({
                    message: "User already exists"
                })
                console.error(error)
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
                console.error(error)
            })

        // else update
        await db.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [user.name, user.email, user.password, params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "User updated"
                })
            })
            .catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to update user"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to update user"
        })
        console.error(error)
    }
}

export async function delete_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = await Database.get_internal()

        const params = request.params as { id: number }

        await db.query("DELETE FROM users WHERE id = ?", [params.id])
            .then((result) => {
                reply.status(StatusCodes.OK).send({
                    message: "User deleted"
                })
            })
            .catch((error) => {
                reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Failed to delete user"
                })
                console.error(error)
            })
    }
    catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Failed to delete user"
        })
        console.error(error)
    }
}