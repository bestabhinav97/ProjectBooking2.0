const express = require("express");
const adminRouter = express.Router();

const adminController = require("../controller/adminController");
const { checkLogin, isAdmin } = require("../middlewear/AuthMiddlewear");

adminRouter.use(checkLogin);
adminRouter.use(isAdmin);

adminRouter.get("/users", adminController.getUsers);
adminRouter.patch("/users/:userId/role", adminController.updateUserRole);

module.exports = adminRouter;