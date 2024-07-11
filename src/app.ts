import Fastify from 'fastify'
import Database from "./database/Database"
import UserRoutes from './routes/UserRoutes'
import TaskRoutes from './routes/TaskRoutes'
import dotenv from 'dotenv'
// import dns from 'node:dns';

const fastify = Fastify({
    logger: true
})

// user routes
fastify.register(UserRoutes);
fastify.register(TaskRoutes);

// start
async function start() {
    try {
        dotenv.config()
        // dns.setDefaultResultOrder('ipv4first');
        await Database.reset()
        await fastify.listen({ port: Number(process.env.APP_PORT), host: process.env.APP_HOST })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();