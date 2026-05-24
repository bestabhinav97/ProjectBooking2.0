const adminUsersModel = require("../model/supaAdminUsers");

module.exports.getUsers = async (req, res, next) => {
  try {
    const data = await adminUsersModel.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "USERS FOUND",
      data,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    next(error);
  }
};

module.exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const updatedUser = await adminUsersModel.updateUserRole(userId, role);

    return res.status(200).json({
      success: true,
      message: "USER ROLE UPDATED",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    next(error);
  }
};