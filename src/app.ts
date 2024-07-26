import Fastify from 'fastify'
import UserRoutes from './routes/UserRoutes'
import TaskRoutes from './routes/TaskRoutes'
import Database from './database/Database'
import utils from './utils'
import { StatusCodes } from 'http-status-codes'
import * as dotenv from 'dotenv';
dotenv.config();

const fastify = Fastify({
    logger: true
})

fastify.get("/", async (request, reply) => {
    return { hello: "world" }
})

fastify.get("/reset-db", async (request, reply) => {
    await Database.reset();
    utils.reply_success(reply, StatusCodes.OK, "Database reset successfully")
})

// routes
fastify.register(UserRoutes);
fastify.register(TaskRoutes);

// start
async function start() {
    try {
        await fastify.listen({ host: "0.0.0.0", port: 3333 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();