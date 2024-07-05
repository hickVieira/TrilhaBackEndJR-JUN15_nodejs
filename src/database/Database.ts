import mysql from 'mysql2/promise';
import fs from 'fs';

export default class Database {
    static pool: mysql.Pool

    public static async get() {
        if (!this.pool)
            this.pool = await mysql.createPool({
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
        let sql = fs.readFileSync("src/database/dbreset.sql", 'utf8');

        // run sql
        const db = await this.get();
        await db.query(sql);
    }
}