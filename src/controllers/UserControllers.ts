import { FastifyRequest, FastifyReply } from "fastify"
import { StatusCodes } from "http-status-codes"
import { User, UserWithId } from "../models/UserModels"
import Database from "../database/Database"
import utils from "../utils"
import Err from "../Err"

export async function get_all_users(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get all users
        await db.user
            .findMany()
            .then((result) => {
                reply.status(StatusCodes.OK).send(result.map((user) => { return user as User }))
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function get_user_by_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // get user
        await db.user
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User does not exist")

                reply.status(StatusCodes.OK).send(result as User)
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function register_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection();

        // get new user object
        const user = request.body as User

        // validate
        if (user.name == null || user.name == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Name is required")
        if (user.email == null || user.email == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Email is required")
        if (user.password == null || user.password == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Password is required")

        // check if email already exists
        await db.user
            .findUnique({
                where: {
                    email: user.email
                }
            })
            .then((result) => {
                if (result != null)
                    throw new Err(StatusCodes.CONFLICT, "User already exists")
            })

        // insert user
        await db.user
            .create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    isAdmin: false
                }
            })
            .then((result) => {
                // get user
                const user = result as UserWithId

                // create token
                const token = utils.create_token({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, 4)

                // send response
                reply.status(StatusCodes.CREATED).send({
                    message: "User created successfully",
                    token: token.compact(),
                })
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function login_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get user login data
        const loginData = request.body as { email: string, password: string }

        // validate
        if (loginData.email == null || loginData.email == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Email is required")
        if (loginData.password == null || loginData.password == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Password is required")

        // check if user exists
        await db.user
            .findUnique({
                where: {
                    email: loginData.email
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User not found")

                // get user
                const user = result as UserWithId

                // check if password is correct
                if (user.password != loginData.password)
                    throw new Err(StatusCodes.UNAUTHORIZED, "Wrong password")

                // create token
                const token = utils.create_token({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, 4)

                reply.status(StatusCodes.OK).send({
                    message: "User logged in successfully",
                    token: token.compact(),
                })
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function put_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get new user object
        const newInfo = request.body as { name: string, email: string, password: string, isAdmin: boolean }
        const params = request.params as { id: number }

        // validate
        if (newInfo.name == null || newInfo.name == "")
            throw new Err(StatusCodes.UNAUTHORIZED, "Name is required")
        if (newInfo.email == null || newInfo.email == "")
            throw new Err(StatusCodes.UNAUTHORIZED, "Email is required")
        if (newInfo.password == null || newInfo.password == "")
            throw new Err(StatusCodes.UNAUTHORIZED, "Password is required")
        if (newInfo.isAdmin == null)
            throw new Err(StatusCodes.UNAUTHORIZED, "Is admin is required")

        // check if user exists
        await db.user
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User does not exist")
            })

        // get user
        let user: User = {} as User;
        await db.user
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User does not exist")

                // get user
                user = result as User

                // assign data
                user.name = newInfo.name ?? user.name
                user.email = newInfo.email ?? user.email
                user.password = newInfo.password ?? user.password
                user.isAdmin = newInfo.isAdmin ?? user.isAdmin
            })

        // update user
        await db.user
            .update({
                where: {
                    id: Number(params.id)
                },
                data: user
            })
            .then((result) => {
                utils.reply_success(reply, StatusCodes.OK, "User updated successfully")
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function patch_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get new user object
        const newInfo = request.body as { name: string, email: string, password: string }
        const params = request.params as { id: number }

        // validate
        if (newInfo.name == null || newInfo.name == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Name is required")
        if (newInfo.email == null || newInfo.email == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Email is required")
        if (newInfo.password == null || newInfo.password == "")
            throw new Err(StatusCodes.BAD_REQUEST, "Password is required")

        // check if user exists
        await db.user
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User does not exist")
            })

        // chekc if email already exists
        await db.user
            .findMany({
                where: {
                    email: newInfo.email
                }
            })
            .then((result) => {
                if (result.length > 1)
                    throw new Err(StatusCodes.CONFLICT, "Email already exists")
            })

        // get user
        let user: User = {} as User;
        await db.user
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User does not exist")

                user = result as User

                // assign data
                user.name = newInfo.name ?? user.name
                user.email = newInfo.email ?? user.email
                user.password = newInfo.password ?? user.password
            })

        // update
        await db.user
            .update({
                where: {
                    id: Number(params.id)
                },
                data: user
            })
            .then((result) => {
                utils.reply_success(reply, StatusCodes.OK, "User updated successfully")
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}

export async function delete_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // check if user exists
        await db.user
            .findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                if (result == null)
                    throw new Err(StatusCodes.NOT_FOUND, "User does not exist")
            })

        // delete tasks
        await db.task
            .deleteMany({
                where: {
                    ownerId: Number(params.id)
                }
            })

        // delete user
        await db.user
            .delete({
                where: {
                    id: Number(params.id)
                }
            })
            .then((result) => {
                utils.reply_success(reply, StatusCodes.OK, "User deleted successfully")
            })
    }
    catch (error) {
        utils.reply_error(reply, error)
    }
}