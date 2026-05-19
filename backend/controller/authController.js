/**
 * ========== AUTH CONTROLLER ==========
 * Handles user authentication:
 * - User registration (signUp)
 * - User login and JWT token creation
 * - User logout (cookie clearing)
 */

const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * JWT must be JSON-serializable (no BigInt / Date objects from mysql2 edge cases).
 */
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
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    birthDate: birth,
    zipCode: user.zipCode ?? null,
    country: user.country ?? null,
    phoneNumber: user.phoneNumber ?? null,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl ?? null,
  };
}

/**
 * Dev: SameSite=Lax + Secure=false so http://localhost:5173 → :3000 keeps the session cookie.
 * Prod: SameSite=None + Secure=true for cross-origin HTTPS frontends.
 */
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
 *
 * FLOW:
 * 1. Validate all required fields exist: name, email, password
 * 2. Validate email format using validator library
 * 3. Check if email already exists in database
 * 4. If exists, return 409 Conflict error
 * 5. If new, hash password and insert into database
 * 6. Return new user record (without password)
 *
 * REQUEST BODY:
 *   - name: User's full name
 *   - email: User's email (must be unique and valid format)
 *   - password: User's password (will be hashed before storage)
 */
module.exports.signUp = async (req, res, next) => {
  console.log("HELLO SIGN UP");

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
  console.log(firstName);

  // ===== VALIDATION =====

  // First Name
  if (!firstName?.trim()) {
    return res.status(400).json({
      success: false,
      message: "FIRST NAME IS REQUIRED",
    });
  }

  // Last Name
  if (!lastName?.trim()) {
    return res.status(400).json({
      success: false,
      message: "LAST NAME IS REQUIRED",
    });
  }

  // Birth Date
  if (!birthDay || !birthMonth || !birthYear) {
    return res.status(400).json({
      success: false,
      message: "BIRTH DATE IS REQUIRED",
    });
  }

  // Zip Code
  if (!zipCode?.trim()) {
    return res.status(400).json({
      success: false,
      message: "ZIP CODE IS REQUIRED",
    });
  }

  // Country
  if (!country) {
    return res.status(400).json({
      success: false,
      message: "COUNTRY IS REQUIRED",
    });
  }

  // Email
  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "EMAIL IS REQUIRED",
    });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "INVALID EMAIL",
    });
  }

  // Phone Number
  if (!phoneNumber?.trim()) {
    return res.status(400).json({
      success: false,
      message: "PHONE NUMBER IS REQUIRED",
    });
  }

  // Password
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "PASSWORD IS REQUIRED",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "PASSWORD MUST BE AT LEAST 6 CHARACTERS",
    });
  }

  // Terms checkbox
  if (!terms) {
    return res.status(400).json({
      success: false,
      message: "YOU MUST ACCEPT TERMS",
    });
  }

  try {
    // Check if email already exists
    const result = await userModel.checkExistingEmail(email);

    if (result.length > 0) {
      return res.status(409).json({
        success: false,
        message: "EMAIL ALREADY EXISTS",
      });
    }

    // Convert month name -> number for MySQL DATE
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

    // Format date: YYYY-MM-DD
    const birthDate = `${birthYear}-${formattedMonth}-${String(
      birthDay,
    ).padStart(2, "0")}`;

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
    console.log(error);
    next(error);
  }
};

/**
 * login - Authenticate user and create JWT token
 *
 * FLOW:
 * 1. Validate email and password provided
 * 2. Query database for user with matching email
 * 3. Compare provided password with stored hashed password
 * 4. If match, create JWT token signed with JWT_SECRET
 * 5. Set token as httpOnly cookie (secure, can't be accessed by JS)
 * 6. Return user object (without password) to client
 *
 * REQUEST BODY:
 *   - email: User's registered email
 *   - password: User's password (will be compared to hash)
 *
 * RESPONSE:
 *   - Sets httpOnly cookie with JWT token
 *   - Returns user data (userId, name, email, role)
 */
module.exports.login = async (req, res, next) => {
  try {
    console.log("controller touched");
    const { email, password } = req.body;

    // ===== VALIDATION =====
    if (!email) {
      return res.status(400).json({ success: false, message: "MISSING EMAIL" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "MISSING PASSWORD" });
    }

    // ===== AUTHENTICATE USER =====
    // Model compares password with bcrypt hash and returns user if match
    const result = await userModel.login(email, password);

    if (result == false) {
      // Email not found or password doesn't match
      return res
        .status(404)
        .json({ success: false, message: "INVALID EMAIL OR PASSWORD" });
    } else {
      // ===== CREATE JWT TOKEN =====
      // Token contains user data and expires in 1 hour
      const token = jwt.sign(payloadForJwt(result), process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // ===== SET SECURE COOKIE =====
      // httpOnly: JS can't access (prevents XSS attacks)
      // sameSite: Lax in dev (localhost ports); None+Secure in production for cross-site
      // maxAge: 1 hour in milliseconds (matches JWT expiration)
      res.cookie("token", token, {
        ...authCookieBaseOptions(),
        maxAge: 3600000, // 1 hour
      });

      // ===== RETURN SUCCESS RESPONSE =====
      return res.status(200).json({
        success: true,
        message: "LOGGED IN SUCCESSFULLY",
        user: result,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * me - Return currently authenticated user from token cookie
 *
 * FLOW:
 * 1. Read token from httpOnly cookie
 * 2. Verify JWT token
 * 3. Return user data if valid
 * 4. Return 401 if missing/invalid token
 */
module.exports.me = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const user = await userModel.getPublicUserById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Auth me error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * logout - Clear user session by removing token cookie
 *
 * FLOW:
 * 1. Clear 'token' cookie from response
 * 2. Return success message to client
 * 3. Browser will delete the cookie
 * 4. User is logged out (future requests won't have token)
 */
module.exports.logout = async (req, res, next) => {
  try {
    // Clear the 'token' cookie with same options as when setting it
    res.clearCookie("token", authCookieBaseOptions());

    return res.status(200).json({
      success: true,
      message: "LOGGED OUT SUCCESSFULLY",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const forgotPasswordMessage = {
  success: true,
  message:
    "If that email is registered, you will receive password reset instructions.",
};

/**
 * forgotPassword — store reset token (no email integration).
 * In non-production, response includes devResetLink for local testing.
 */
module.exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body?.email?.trim();

    if (!email || !validator.isEmail(email)) {
      return res.status(200).json(forgotPasswordMessage);
    }

    const row = await userModel.findByEmailLoose(email);

    if (!row) {
      return res.status(200).json(forgotPasswordMessage);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await userModel.setPasswordResetToken(row.userId, token, expiresAt);

    const base = (process.env.FRONTEND_URL || "http://localhost:5173").replace(
      /\/$/,
      "",
    );
    const resetLink = `${base}/reset-password?token=${token}`;
    console.log("[forgot-password] reset link (dev):", resetLink);

    const payload = { ...forgotPasswordMessage };
    if (process.env.NODE_ENV !== "production") {
      payload.devResetLink = resetLink;
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * resetPassword — set new password using token from forgot-password flow.
 */
module.exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "RESET_TOKEN_REQUIRED",
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS",
      });
    }

    const row = await userModel.findByPasswordResetToken(token.trim());

    if (!row || !row.passwordResetExpires) {
      return res.status(400).json({
        success: false,
        message: "INVALID_OR_EXPIRED_RESET_TOKEN",
      });
    }

    if (new Date(row.passwordResetExpires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "INVALID_OR_EXPIRED_RESET_TOKEN",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await userModel.updatePassword(row.userId, hashed);
    await userModel.clearPasswordResetToken(row.userId);

    return res.status(200).json({
      success: true,
      message: "PASSWORD_UPDATED_YOU_CAN_LOG_IN",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * updateProfile — PATCH fields for authenticated user.
 */
module.exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

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
        return res.status(413).json({
          success: false,
          message: "PROFILE_IMAGE_TOO_LARGE",
        });
      }
      throw err;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
