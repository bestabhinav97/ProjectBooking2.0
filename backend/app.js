// ===== DEPENDENCIES =====
const express = require("express");
const { supabase } = require('./db/supabase.js');
const cookie = require("cookie-parser");
const helmet = require("helmet");
const errorHandler = require("./middlewear/errorHandler");
const bookingController = require("./controller/bookingController");
const cors = require("cors");
const path = require("path");

// ===== IMPORT ROUTE HANDLERS =====
// Each router handles a specific resource (auth, rooms, bookings, admin)
const authRouter = require("./routes/authRoute");
const roomRouter = require("./routes/roomRoute");
const bookingRouter = require("./routes/bookingRoute");
const adminRouter = require("./routes/adminRoute");

// ===== INITIALIZE EXPRESS APP =====
const app = express();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  bookingController.handleWebHook,
);

// ===== MIDDLEWARE STACK =====
// Set security HTTP headers
app.use(cookie()); // Parse cookies from requests
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  "/room-photos",
  express.static(path.join(__dirname, "views", "room-photos")),
);

// ===== ROUTE HANDLERS =====

app.use("/auth", authRouter);
app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);
app.use("/admin", adminRouter);

// ===== HEALTH CHECK ROUTE =====
app.get("/", (req, res) => {
  res.send("Hello");
});

app.get('/api/items', async (req, res) => {
  // Query the 'items' table for all records
  const { data, error } = await supabase
    .from('items')
    .select('*');

  // If Supabase returns an error, send it to the client
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Otherwise, return the database rows
  return res.json(data);
});

// ===== START SERVER =====//GLOBAL ERROR HANDLER
app.use(errorHandler);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
