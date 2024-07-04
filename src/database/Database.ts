import mysql from 'mysql2/promise';
import fs from 'fs';

export default class Database {
    static pool: mysql.Pool

    public static async get() {
        if (!this.pool)
            this.pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                database: 'test',
                waitForConnections: true,
                connectionLimit: 10,
                maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
                idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
            });
        return this.pool;
    }

    public static async reset() {
        // open sql file
        const sql = fs.readFileSync("src/database/dbreset.sql", 'utf8');

        // run sql
        const db = await this.get();
        db.execute(sql);
    }
}