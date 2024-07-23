import mysql2 from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export default class Database {
    static pool: mysql2.Pool

    public static get_prisma_connection() {
        return new PrismaClient();
    }

    public static async get_internal() {
        if (!this.pool)
            this.pool = await mysql2.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_ROOT_PASSWORD,
                database: process.env.DB_NAME,
                port: Number(process.env.DB_PORT),
                waitForConnections: true,
                connectionLimit: 10,
                maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
                idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
                queueLimit: 0,
                enableKeepAlive: true,
                multipleStatements: true,
            });

        return this.pool;
    }

    public static async get_external() {
        if (!this.pool)
            this.pool = await mysql2.createPool({
                host: "localhost",
                user: process.env.DB_USER,
                password: process.env.DB_ROOT_PASSWORD,
                database: process.env.DB_NAME,
                port: Number(process.env.DB_PORT),
                waitForConnections: true,
                connectionLimit: 10,
                maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
                idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
                queueLimit: 0,
                enableKeepAlive: true,
                multipleStatements: true,
            });

        return this.pool;
    }

    public static async reset(db: mysql2.Pool) {
        // old
        // {
        //     let sql = fs.readFileSync(path.resolve(__dirname, "..", "dbreset.sql"), 'utf8');
        //     await db.query(sql)
        //         .catch((err) => {
        //             console.error("Error reseting database");
        //             console.error(err);
        //             this.reset(db);
        //         });
        // }

        // new
        {
            const db = this.get_prisma_connection();

            // reset sqlite sequence
            await db
                .$executeRaw`DELETE FROM sqlite_sequence`
                .catch((err) => {
                    console.error("Error reseting database");
                    console.error(err);
                });

            // reset tables
            await db
                .$transaction([
                    db.task.deleteMany(),
                    db.user.deleteMany(),
                ])
                .catch((err) => {
                    console.error("Error reseting database");
                    console.error(err);
                });

            // add fake users
            await db.user
                .createMany({
                    data: [
                        { name: 'John Doe', email: 'john@example.com', password: 'password123', isAdmin: true },
                        { name: 'Jane Smith', email: 'jane@example.com', password: 'qwerty123', isAdmin: false },
                        { name: 'Fulano Siclano', email: 'fulano@example.com', password: 'brasil123', isAdmin: false },
                        { name: 'Luizo Henrico', email: 'luizeco@example.com', password: 'abc123', isAdmin: false },
                    ]
                })
                .then(() => {
                })
                .catch((err) => {
                    console.error("Error reseting database");
                    console.error(err);
                });

            // add fake tasks
            await db.task
                .createMany({
                    data: [
                        { ownerId: 1, name: 'Task 1', description: 'This is task 1', priority: 1, points: 10, startDate: new Date(Date.now()), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), done: false },
                        { ownerId: 3, name: 'Task 2', description: 'This is task 2', priority: 2, points: 20, startDate: new Date(Date.now()), endDate: new Date(Date.now()), done: false },
                        { ownerId: 1, name: 'Task 3', description: 'This is task 3', priority: 3, points: 30, startDate: new Date(Date.now()), endDate: new Date(Date.now()), done: false },
                        { ownerId: 2, name: 'Task 4', description: 'This is task 4', priority: 3, points: 40, startDate: new Date(Date.now()), endDate: new Date(Date.now()), done: false },
                        { ownerId: 1, name: 'Task 5', description: 'This is task 5', priority: 4, points: 50, startDate: new Date(Date.now()), endDate: new Date(Date.now()), done: false },
                    ]
                })
                .then(() => {
                })
                .catch((err) => {
                    console.error("Error reseting database");
                    console.error(err);
                });
        }
    }
}