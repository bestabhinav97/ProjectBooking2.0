const supabaseModule = require("../db/supabase.js");

const supabase = supabaseModule.supabase || supabaseModule;

const ALLOWED_ROLES = ["customer", "staff", "admin"];

function normalizeUser(user) {
  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed user";

  return {
    userId: user.userId,
    name: fullName,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    birthDate: user.birthDate || "",
    zipCode: user.zipCode || "",
    country: user.country || "",
    role: user.role || "customer",
  };
}

module.exports.getAllUsers = async () => {
  const { data: users, error } = await supabase
    .from("user")
    .select(
      `
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate,
      zipCode,
      country,
      role
      `
    )
    .order("userId", { ascending: false });

  if (error) {
    throw error;
  }

  const safeUsers = (users || []).map(normalizeUser);

  return {
    stats: {
      totalUsers: safeUsers.length,
      customers: safeUsers.filter((user) => user.role === "customer").length,
      staff: safeUsers.filter((user) => user.role === "staff").length,
      admins: safeUsers.filter((user) => user.role === "admin").length,
    },
    users: safeUsers,
  };
};

module.exports.updateUserRole = async (userId, role) => {
  if (!ALLOWED_ROLES.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const { data, error } = await supabase
    .from("user")
    .update({ role })
    .eq("userId", userId)
    .select(
      `
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate,
      zipCode,
      country,
      role
      `
    )
    .single();

  if (error) {
    throw error;
  }

  return normalizeUser(data);
};