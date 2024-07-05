import Fastify from 'fastify'
import Database from "./database/Database"
import dotenv from 'dotenv'
// import dns from 'node:dns';

const fastify = Fastify({
    logger: true
})

// user routes
fastify.register(require('./routes/UserRoutes.ts'));

// start
async function start() {
    try {
        dotenv.config()
        // dns.setDefaultResultOrder('ipv4first');
        await Database.reset()
        await fastify.listen({ host: process.env.APP_HOST, port: Number(process.env.APP_PORT) })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();