// const mysql = require("mysql2/promise"); // Use promise version for async/await
// require("dotenv").config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DB,
// });

// async function testConnection() {
//   try {
//     const connection = await db.getConnection();
//     console.log("CONNECTED TO DATABASE");
//     // Release connection back to pool for reuse
//     connection.release();
//   } catch (err) {
//     console.error("DB CONNECTION FAILED:", err);
//   }
// }

// // Execute connection test when module loads
// testConnection();

// module.exports = db;
