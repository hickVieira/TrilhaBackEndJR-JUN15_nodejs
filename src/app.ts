import Fastify from 'fastify'
import { getDatabase, resetDatabase } from './database/Database';

const fastify = Fastify({
    logger: true
})

// user routes
fastify.register(require('./routes/UserRoutes.ts'));

// start
async function start() {
    try {
        await resetDatabase();
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();