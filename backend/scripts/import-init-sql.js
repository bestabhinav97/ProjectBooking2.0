/**
 * Loads db/init.sql using credentials from .env (same as app).
 * Run from backend/backend: npm run db:import
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || "3306";
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
const DB_DB = process.env.DB_DB || "bookingproject";

if (!DB_USER) {
  console.error("Missing DB_USER. Copy .env.example to .env and set DB_USER and DB_PASSWORD.");
  process.exit(1);
}

const sqlPath = path.join(__dirname, "..", "db", "init.sql");
if (!fs.existsSync(sqlPath)) {
  console.error("Missing file:", sqlPath);
  process.exit(1);
}

function mysqlArgs(extra) {
  const args = ["-h", DB_HOST, "-P", String(DB_PORT), "-u", DB_USER];
  if (DB_PASSWORD !== "") {
    args.push(`-p${DB_PASSWORD}`);
  }
  return args.concat(extra);
}

function run(extraArgs, stdin) {
  return spawnSync("mysql", mysqlArgs(extraArgs), {
    input: stdin,
    encoding: "utf-8",
    maxBuffer: 50 * 1024 * 1024,
  });
}

console.log(`Creating database if needed: ${DB_DB}`);
let r = run(["-e", `CREATE DATABASE IF NOT EXISTS \`${DB_DB.replace(/`/g, "")}\`;`]);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout || "mysql failed");
  process.exit(r.status ?? 1);
}

console.log(`Importing ${sqlPath} into ${DB_DB} ...`);
r = run([DB_DB], fs.readFileSync(sqlPath));
if (r.status !== 0) {
  console.error(r.stderr || r.stdout || "mysql import failed");
  process.exit(r.status ?? 1);
}

console.log("Done.");
