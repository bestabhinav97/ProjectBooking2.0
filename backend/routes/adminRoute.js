const express = require("express");
const adminRouter = express.Router();

const adminController = require("../controller/adminController");
const roomController = require("../controller/roomController");
const { checkLogin, isAdmin } = require("../middlewear/AuthMiddlewear");


adminRouter.use(checkLogin);
adminRouter.use(isAdmin);

adminRouter.get("/users", adminController.getUsers);
adminRouter.patch("/users/:userId/role", adminController.updateUserRole);

// ===== ADMIN ROOM MANAGEMENT =====

adminRouter.get("/rooms", roomController.getAllRooms);

adminRouter.post("/rooms", roomController.createRoom);

adminRouter.put(
  "/rooms/:roomNumber",
  roomController.updateRoom
);

adminRouter.delete(
  "/rooms/:roomNumber",
  roomController.deleteRoom
);

module.exports = adminRouter;