import Fastify from 'fastify'
import Database from "./database/Database"

const fastify = Fastify({
    logger: true
})

// user routes
fastify.register(require('./routes/UserRoutes.ts'));

// start
async function start() {
    try {
        await Database.reset()
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();