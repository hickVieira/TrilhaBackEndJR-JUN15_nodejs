import Fastify from 'fastify'
import fastifyMysql from '@fastify/mysql';

const fastify = Fastify({
    logger: true
})

// database connection
fastify.register(fastifyMysql, {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fastify'
})

// user routes
fastify.register(require('./routes/UserRoutes.ts'));

// start
async function start() {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();