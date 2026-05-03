// ===== DEPENDENCIES =====
const express = require("express");
const db = require("./db/db");
const cookie = require("cookie-parser");
const helmet = require("helmet");
const errorHandler = require("./middlewear/errorHandler");

// ===== INITIALIZE EXPRESS APP =====
const app = express();

// ===== MIDDLEWARE STACK =====
app.use(helmet()); // Set security HTTP headers
app.use(cookie()); // Parse cookies from requests

// ===== ROUTE HANDLERS =====

// ===== HEALTH CHECK ROUTE =====
app.get("/", (req, res) => {
  res.send("Hello");
});

// ===== START SERVER =====//GLOBAL ERROR HANDLER
app.use(errorHandler);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
