import { FastifyRequest, FastifyReply } from "fastify"
import { StatusCodes } from "http-status-codes"
import { User, UserWithId } from "../models/UserModels"
import Database from "../database/Database"
import utils from "../utils"

export async function get_all_users(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get all users
        try {
            await db.user
                .findMany()
                .then((result) => {
                    reply.status(StatusCodes.OK).send(result.map((user) => { return user as User }))
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get all users", error)
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get all users", error)
        return
    }
}

export async function get_user_by_id(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // get user
        try {
            await db.user
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    reply.status(StatusCodes.OK).send(result as User)
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get user by id", error)
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get user by id", error)
        return
    }
}

export async function register_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection();

        // get new user object
        const user = request.body as User

        // validate
        try {
            if (user.name == null || user.name == "")
                throw new Error("Name is required")
            if (user.email == null || user.email == "")
                throw new Error("Email is required")
            if (user.password == null || user.password == "")
                throw new Error("Password is required")
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.BAD_REQUEST, "Failed to create user", error)
            return
        }

        // check if email already exists
        try {
            await db.user
                .findUnique({
                    where: {
                        email: user.email
                    }
                })
                .then((result) => {
                    if (result != null)
                        throw new Error("User already exists")
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.CONFLICT, "User already exists", error)
            return
        }

        // insert user
        try {
            await db.user
                .create({
                    data: {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        isAdmin: false
                    }
                })
                // get user
                .then((result) => {
                    const user = result as UserWithId

                    // create token
                    const token = utils.create_token({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, 4)

                    // send response
                    reply.status(StatusCodes.CREATED).send({
                        token: token.compact(),
                    })
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create user", error)
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create user", error)
        return
    }
}

export async function login_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get user login data
        const loginData = request.body as { email: string, password: string }

        // validate
        try {
            if (loginData.email == null || loginData.email == "")
                throw new Error("Email is required")
            if (loginData.password == null || loginData.password == "")
                throw new Error("Password is required")
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.BAD_REQUEST, "Failed to login user", error)
            return
        }

        // check if user exists
        try {
            await db.user
                .findUnique({
                    where: {
                        email: loginData.email
                    }
                })
                .then((result) => {
                    // get user
                    const user = result as UserWithId

                    // check if password is correct
                    if (user.password != loginData.password)
                        throw new Error("Wrong password")

                    // create token
                    const token = utils.create_token({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, 4)

                    reply.status(StatusCodes.OK).send({
                        message: "User logged in successfully",
                        token: token.compact(),
                    })
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.UNAUTHORIZED, "Failed to login user", error)
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to login user", error)
        return
    }
}

export async function put_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get new user object
        const newInfo = request.body as { name: string, email: string, password: string, isAdmin: boolean }
        const params = request.params as { id: number }

        // validate
        try {
            if (newInfo.name == null || newInfo.name == "")
                throw new Error("Name is required")
            if (newInfo.email == null || newInfo.email == "")
                throw new Error("Email is required")
            if (newInfo.password == null || newInfo.password == "")
                throw new Error("Password is required")
            if (newInfo.isAdmin == null)
                throw new Error("Is admin is required")
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.BAD_REQUEST, "Failed to update user", error)
            return
        }

        // check if user exists
        try {
            await db.user
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    if (result == null)
                        throw new Error("User does not exist")
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.NOT_FOUND, "User does not exist", error)
            return
        }

        // get user
        let user: User = {} as User;
        try {
            await db.user
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    user = result as User

                    // assign data
                    user.name = newInfo.name ?? user.name
                    user.email = newInfo.email ?? user.email
                    user.password = newInfo.password ?? user.password
                    user.isAdmin = newInfo.isAdmin ?? user.isAdmin
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user", error)
            return
        }

        // update user
        try {
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
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user", error)
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user", error)
        return
    }
}

export async function patch_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        // get new user object
        const newInfo = request.body as { name: string, email: string, password: string }
        const params = request.params as { id: number }

        // validate
        try {
            if (newInfo.name == null || newInfo.name == "")
                throw new Error("Name is required")
            if (newInfo.email == null || newInfo.email == "")
                throw new Error("Email is required")
            if (newInfo.password == null || newInfo.password == "")
                throw new Error("Password is required")
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.BAD_REQUEST, "Failed to update user", error)
            return
        }

        // check if user exists
        try {
            await db.user
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    if (result == null)
                        throw new Error("User does not exist")
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.NOT_FOUND, "User does not exist", error)
            return
        }

        // chekc if email already exists
        try {
            await db.user
                .findMany({
                    where: {
                        email: newInfo.email
                    }
                })
                .then((result) => {
                    if (result.length > 1)
                        throw new Error("Email already exists")
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.CONFLICT, "Email already exists", error)
            return
        }

        // get user
        let user: User = {} as User;
        try {
            await db.user
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    user = result as User

                    // assign data
                    user.name = newInfo.name ?? user.name
                    user.email = newInfo.email ?? user.email
                    user.password = newInfo.password ?? user.password
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user", error)
            return
        }

        // update
        try {
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
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user", error)
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user", error)
        return
    }
}

export async function delete_user(request: FastifyRequest, reply: FastifyReply) {
    try {
        const db = Database.get_prisma_connection()

        const params = request.params as { id: number }

        // check if user exists
        try {
            await db.user
                .findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })
                .then((result) => {
                    if (result == null)
                        throw new Error("User does not exist")
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.NOT_FOUND, "User does not exist", error)
            return
        }

        // delete tasks
        try {
            await db.task
                .deleteMany({
                    where: {
                        ownerId: Number(params.id)
                    }
                })
        }
        catch (error) {
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete user", error)
            return
        }

        // delete user
        try {
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
            utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete user", error)
            return
        }
    }
    catch (error) {
        utils.reply_error(reply, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete user", error)
        return
    }
}