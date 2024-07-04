// import fastifyMysql from "@fastify/mysql";
// import fs from "fs";

// export async function resetDatabase() {
//     if (!fs.existsSync("src/database/database.db")) {
//         return;
//     }
    
//     // delete database
//     fs.unlinkSync("src/database/database.db");

//     // open sql file
//     const sql = fs.readFileSync("src/database/dbreset.sql", 'utf8');

//     // run sql
//     const db = await getDatabase();
//     db.serialize(() => {
//         db.run(sql);
//     })
//     db.close()
// }