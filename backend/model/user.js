/**
 * ========== USER MODEL ==========
 * Database layer for user authentication operations
 * Handles signup, login, and password hashing
 */

const db = require("../db/db");
const bcrypt = require("bcrypt");

/**
 * checkExistingEmail - Check if email already exists in database
 *
 * USED FOR: Registration form to prevent duplicate accounts
 * @param {string} email - Email address to check
 * @returns {array} Array of user records (empty if email not registered)
 */
module.exports.checkExistingEmail = async (email) => {
  try {
    const [result] = await db.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * signUp - Register new user account
 *
 * FLOW:
 * 1. Hash password using bcrypt (10 rounds for security)
 * 2. Insert user record with hashed password (never store plain text!)
 * 3. Fetch and return the newly created user record
 * 4. Password is not included in return for security
 *
 * @param {string} name - User's full name
 * @param {string} email - User's email address (should be unique)
 * @param {string} password - Plain text password (will be hashed)
 * @returns {object} New user object (without password)
 */
module.exports.signUp = async (
  firstName,
  lastName,
  birthDate,
  zipCode,
  country,
  phoneNumber,
  email,
  password,
) => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await db.execute(
      `
      INSERT INTO user
      (
        firstName,
        lastName,
        birthDate,
        zipCode,
        country,
        phoneNumber,
        email,
        password
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        firstName,
        lastName,
        birthDate,
        zipCode,
        country,
        phoneNumber,
        email,
        hashedPassword,
      ],
    );

    // Fetch created user
    const [rows] = await db.execute("SELECT * FROM user WHERE userId = ?", [
      result.insertId,
    ]);

    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * login - Authenticate user and return user data if credentials valid
 *
 * FLOW:
 * 1. Query database for user with matching email
 * 2. If user not found, return false immediately
 * 3. If user found, compare provided password with stored hash using bcrypt
 * 4. If password matches, remove password field and return user object
 * 5. If password doesn't match, return false
 *
 * @param {string} email - User's email address
 * @param {string} password - Plain text password to verify
 * @returns {object|false} User object if credentials valid, false otherwise
 */
module.exports.login = async (email, password) => {
  try {
    // Query user by email
    const [rows] = await db.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    const user = rows[0];

    // If no user with this email exists, return false immediately
    if (!user) {
      return false;
    }

    /**
     * Compare provided password with stored hash
     * bcrypt.compare handles the hash comparison securely
     * Returns boolean: true if match, false if no match
     */
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      return await module.exports.getPublicUserById(user.userId);
    }

    // Password is incorrect
    return false;
  } catch (error) {
    // Log internal errors without exposing to client
    console.error("Database error during login:", error);
    throw error;
  }
};

/**
 * Public profile fields (never includes password or reset secrets)
 */
module.exports.getPublicUserById = async (userId) => {
  const [rows] = await db.execute(
    `SELECT userId, firstName, lastName, birthDate, zipCode, country,
            phoneNumber, email, role, profileImageUrl
     FROM user WHERE userId = ?`,
    [userId],
  );
  const u = rows[0];
  if (!u) return null;
  return u;
};

module.exports.findByEmailLoose = async (email) => {
  const [rows] = await db.execute(
    "SELECT userId, email FROM user WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))",
    [email],
  );
  return rows[0] || null;
};

module.exports.setPasswordResetToken = async (userId, token, expiresAt) => {
  await db.execute(
    "UPDATE user SET passwordResetToken = ?, passwordResetExpires = ? WHERE userId = ?",
    [token, expiresAt, userId],
  );
};

module.exports.findByPasswordResetToken = async (token) => {
  const [rows] = await db.execute(
    `SELECT userId, email, password, passwordResetExpires
     FROM user WHERE passwordResetToken = ?`,
    [token],
  );
  return rows[0] || null;
};

module.exports.clearPasswordResetToken = async (userId) => {
  await db.execute(
    "UPDATE user SET passwordResetToken = NULL, passwordResetExpires = NULL WHERE userId = ?",
    [userId],
  );
};

module.exports.updatePassword = async (userId, hashedPassword) => {
  await db.execute("UPDATE user SET password = ? WHERE userId = ?", [
    hashedPassword,
    userId,
  ]);
};

const PROFILE_IMAGE_MAX = 600000;

module.exports.updateProfile = async (userId, fields) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    zipCode,
    country,
    birthDate,
    profileImageUrl,
  } = fields;

  const updates = [];
  const values = [];

  if (firstName !== undefined) {
    updates.push("firstName = ?");
    values.push(firstName?.trim() || null);
  }
  if (lastName !== undefined) {
    updates.push("lastName = ?");
    values.push(lastName?.trim() || null);
  }
  if (phoneNumber !== undefined) {
    updates.push("phoneNumber = ?");
    values.push(phoneNumber?.trim() || null);
  }
  if (zipCode !== undefined) {
    updates.push("zipCode = ?");
    values.push(zipCode?.trim() || null);
  }
  if (country !== undefined) {
    updates.push("country = ?");
    values.push(country?.trim() || null);
  }
  if (birthDate !== undefined) {
    updates.push("birthDate = ?");
    values.push(birthDate || null);
  }
  if (profileImageUrl !== undefined) {
    if (profileImageUrl && profileImageUrl.length > PROFILE_IMAGE_MAX) {
      const err = new Error("PROFILE_IMAGE_TOO_LARGE");
      err.code = "PROFILE_IMAGE_TOO_LARGE";
      throw err;
    }
    updates.push("profileImageUrl = ?");
    values.push(profileImageUrl || null);
  }

  if (updates.length === 0) {
    return module.exports.getPublicUserById(userId);
  }

  values.push(userId);
  await db.execute(`UPDATE user SET ${updates.join(", ")} WHERE userId = ?`, values);
  return module.exports.getPublicUserById(userId);
};
