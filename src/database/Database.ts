import { PrismaClient } from '@prisma/client';

export default class Database {
    private static _db: PrismaClient;

    public static get() {
        if (this._db == null)
            this._db = new PrismaClient();
        return this._db;
    }

    public static async reset() {
        const db = this.get();

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

        // reset increment sequence
        await db
            .$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`
            .catch((err) => {
                console.error("Error reseting database");
                console.error(err);
            });
        await db
            .$queryRaw`ALTER SEQUENCE "Task_id_seq" RESTART WITH 1;`
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
            .catch((err) => {
                console.error("Error reseting database");
                console.error(err);
            });
        
        db.$disconnect();
    }
}