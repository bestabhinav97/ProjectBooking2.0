/**
 * ========== AUTH CONTROLLER ==========
 * Handles user authentication via Supabase database layer
 */

const crypto = require("crypto");
const validator = require("validator");
const userModel = require("../model/supaUser"); // Points to your new model
const jwt = require("jsonwebtoken");
require("dotenv").config();

function payloadForJwt(user) {
  if (!user) return null;
  let birth = user.birthDate;
  if (birth instanceof Date) {
    birth = birth.toISOString().slice(0, 10);
  } else if (birth != null) {
    birth = String(birth).slice(0, 10);
  } else {
    birth = null;
  }
  return {
    userId: Number(user.userId),
    email: user.email,
    role: user.role,
  };
}

function authCookieBaseOptions() {
  const prod = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    path: "/",
    sameSite: prod ? "none" : "lax",
    secure: prod,
  };
}

/**
 * signUp - Register a new user
 */
module.exports.signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    birthDay,
    birthMonth,
    birthYear,
    zipCode,
    country,
    email,
    phoneNumber,
    password,
    terms,
  } = req.body;

  // ===== VALIDATION =====
  if (!firstName?.trim())
    return res
      .status(400)
      .json({ success: false, message: "FIRST NAME IS REQUIRED" });
  if (!lastName?.trim())
    return res
      .status(400)
      .json({ success: false, message: "LAST NAME IS REQUIRED" });
  if (!birthDay || !birthMonth || !birthYear)
    return res
      .status(400)
      .json({ success: false, message: "BIRTH DATE IS REQUIRED" });
  if (!zipCode?.trim())
    return res
      .status(400)
      .json({ success: false, message: "ZIP CODE IS REQUIRED" });
  if (!country)
    return res
      .status(400)
      .json({ success: false, message: "COUNTRY IS REQUIRED" });
  if (!email?.trim())
    return res
      .status(400)
      .json({ success: false, message: "EMAIL IS REQUIRED" });
  if (!validator.isEmail(email))
    return res.status(400).json({ success: false, message: "INVALID EMAIL" });
  if (!phoneNumber?.trim())
    return res
      .status(400)
      .json({ success: false, message: "PHONE NUMBER IS REQUIRED" });
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: "PASSWORD IS REQUIRED" });
  if (password.length < 6)
    return res.status(400).json({
      success: false,
      message: "PASSWORD MUST BE AT LEAST 6 CHARACTERS",
    });
  if (!terms)
    return res
      .status(400)
      .json({ success: false, message: "YOU MUST ACCEPT TERMS" });

  try {
    // Check if email already exists
    const existingUsers = await userModel.checkExistingEmail(email);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "EMAIL ALREADY EXISTS",
      });
    }

    const months = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    const formattedMonth = months[birthMonth];
    const birthDate = `${birthYear}-${formattedMonth}-${String(birthDay).padStart(2, "0")}`;

    // Sign up user
    const insertedUser = await userModel.signUp(
      firstName,
      lastName,
      birthDate,
      zipCode,
      country,
      phoneNumber,
      email,
      password,
    );

    return res.status(201).json({
      success: true,
      message: "SIGNED UP SUCCESSFULLY",
      data: insertedUser,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * login - Authenticate user and create JWT token
 */
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "MISSING EMAIL" });
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "MISSING PASSWORD" });

    const result = await userModel.login(email, password);

    if (result === false) {
      return res
        .status(404)
        .json({ success: false, message: "INVALID EMAIL OR PASSWORD" });
    }

    const token = jwt.sign(payloadForJwt(result), process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      ...authCookieBaseOptions(),
      maxAge: 3600000,
    });

    return res.status(200).json({
      success: true,
      message: "LOGGED IN SUCCESSFULLY",
      user: result,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * me - Return currently authenticated user from token cookie
 */
module.exports.me = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });

    const user = await userModel.getPublicUserById(userId);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });

    res.set("Cache-Control", "no-store, private, must-revalidate");
    res.set("Pragma", "no-cache");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Auth me error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * logout - Clear user session by removing token cookie
 */
module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token", authCookieBaseOptions());
    return res.status(200).json({
      success: true,
      message: "LOGGED OUT SUCCESSFULLY",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const forgotPasswordMessage = {
  success: true,
  message:
    "If that email is registered, you will receive password reset instructions.",
};

/**
 * forgotPassword — store reset token
 */
module.exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body?.email?.trim();
    if (!email || !validator.isEmail(email))
      return res.status(200).json(forgotPasswordMessage);

    const row = await userModel.findByEmailLoose(email);
    if (!row) return res.status(200).json(forgotPasswordMessage);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await userModel.setPasswordResetToken(row.userId, token, expiresAt);

    const base = (process.env.FRONTEND_URL || "http://localhost:5173").replace(
      /\/$/,
      "",
    );
    const resetLink = `${base}/reset-password?token=${token}`;

    // Note: Assuming emailHelper.sendEmail remains unmodified elsewhere in utils
    try {
      const emailHelper = require("../utils/email");
      await emailHelper.sendEmail({
        email: row.email,
        subject: "Reset your password",
        message: `You requested a password reset.\n\nClick here:\n${resetLink}`,
      });
    } catch (emailError) {
      console.error(
        "[forgot-password] failed to send reset email:",
        emailError.message,
      );
    }

    const payload = { ...forgotPasswordMessage };
    if (process.env.NODE_ENV !== "production") {
      payload.devResetLink = resetLink;
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * resetPassword — set new password using token
 */
module.exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || typeof token !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "RESET_TOKEN_REQUIRED" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS",
      });
    }

    const row = await userModel.findByPasswordResetToken(token.trim());
    if (!row || !row.passwordResetExpires) {
      return res
        .status(400)
        .json({ success: false, message: "INVALID_OR_EXPIRED_RESET_TOKEN" });
    }

    if (new Date(row.passwordResetExpires) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "INVALID_OR_EXPIRED_RESET_TOKEN" });
    }

    const bcrypt = require("bcrypt");
    const hashed = await bcrypt.hash(newPassword, 12);
    await userModel.updatePassword(row.userId, hashed);
    await userModel.clearPasswordResetToken(row.userId);

    return res
      .status(200)
      .json({ success: true, message: "PASSWORD_UPDATED_YOU_CAN_LOG_IN" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * updateProfile — PATCH fields for authenticated user
 */
module.exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const {
      firstName,
      lastName,
      phoneNumber,
      zipCode,
      country,
      birthDate,
      profileImageUrl,
    } = req.body || {};

    if (
      birthDate !== undefined &&
      birthDate !== null &&
      birthDate !== "" &&
      !validator.isISO8601(String(birthDate), { strict: true }) &&
      !/^\d{4}-\d{2}-\d{2}$/.test(String(birthDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "INVALID_BIRTH_DATE_USE_YYYY_MM_DD",
      });
    }

    try {
      const user = await userModel.updateProfile(userId, {
        firstName,
        lastName,
        phoneNumber,
        zipCode,
        country,
        birthDate,
        profileImageUrl,
      });

      return res.status(200).json({ success: true, user });
    } catch (err) {
      if (err.code === "PROFILE_IMAGE_TOO_LARGE") {
        return res
          .status(413)
          .json({ success: false, message: "PROFILE_IMAGE_TOO_LARGE" });
      }
      throw err;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
