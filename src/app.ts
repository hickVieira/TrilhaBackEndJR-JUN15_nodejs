import Fastify from 'fastify'
import UserRoutes from './routes/UserRoutes'
import TaskRoutes from './routes/TaskRoutes'
import dotenv from 'dotenv'
dotenv.config()

const fastify = Fastify({
    logger: true
})

// user routes
fastify.register(UserRoutes);
fastify.register(TaskRoutes);

// start
async function start() {
    try {
        await fastify.listen({ port: Number(process.env.APP_PORT), host: process.env.APP_HOST })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();