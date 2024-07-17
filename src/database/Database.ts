import mysql2 from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export default class Database {
    static pool: mysql2.Pool

    public static async get() {
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

    public static async reset() {
        // open sql file
        let sql = fs.readFileSync(path.resolve(__dirname, "..", "dbreset.sql"), 'utf8');

        // run sql
        const db = await this.get();

        await db.query(sql).then(() => {
        }).catch((err) => {
            console.error("Error reseting database");
            console.error(err);
            this.reset();
        });
    }
}