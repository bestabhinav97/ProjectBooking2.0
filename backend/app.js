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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);
app.use(cookie()); // Parse cookies from requests
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

