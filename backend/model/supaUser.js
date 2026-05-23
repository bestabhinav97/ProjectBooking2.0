/**
 * ========== SUPABASE USER MODEL ==========
 * Database layer for user authentication operations using Supabase
 */

// Assuming your supabase client is configured and exported from a file like '../db/supabaseClient'
const { supabase } = require("../db/supabase");
const bcrypt = require("bcrypt");

/**
 * checkExistingEmail - Check if email already exists in the user table
 */
module.exports.checkExistingEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in checkExistingEmail:", error);
    throw error;
  }
};

/**
 * signUp - Register new user account
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
    const hashedPassword = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from("user")
      .insert([
        {
          firstName,
          lastName,
          birthDate,
          zipCode,
          country,
          phoneNumber,
          email,
          password: hashedPassword,
        },
      ])
      .select()
      .single(); // Returns the inserted object directly

    if (error) throw error;

    // Explicitly delete the password from the returned object for security
    if (data) delete data.password;
    return data;
  } catch (error) {
    console.error("Error in signUp:", error);
    throw error;
  }
};

/**
 * login - Authenticate user and return public user data if credentials are valid
 */
module.exports.login = async (email, password) => {
  try {
    const { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .maybeSingle(); // Returns null safely if no row matches

    if (error) throw error;
    if (!user) return false;

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return await module.exports.getPublicUserById(user.userId);
    }

    return false;
  } catch (error) {
    console.error("Database error during login:", error);
    throw error;
  }
};

/**
 * getPublicUserById - Fetch public profile fields without breaking on missing columns
 */
module.exports.getPublicUserById = async (userId) => {
  try {
    const { data: user, error } = await supabase
      .from("user")
      .select(
        `
        userId, firstName, lastName, birthDate, zipCode, country,
        phoneNumber, email, role, profileImageUrl
      `,
      )
      .eq("userId", userId)
      .maybeSingle();

    // Supabase handles missing columns safely, but if postgrest explicitly throws an error
    // due to a completely missing column, it will hit the catch block below.
    if (error) throw error;
    if (!user) return null;

    let pic = user.profileImageUrl;
    if (pic == null || String(pic).trim() === "") {
      pic = null;
    } else {
      pic = String(pic);
    }
    user.profileImageUrl = pic;

    return user;
  } catch (error) {
    // Fallback if profileImageUrl column throws an unhandled system error
    if (error.message && error.message.includes("profileImageUrl")) {
      const { data: fallbackUser, error: fallbackError } = await supabase
        .from("user")
        .select(
          `
          userId, firstName, lastName, birthDate, zipCode, country,
          phoneNumber, email, role
        `,
        )
        .eq("userId", userId)
        .maybeSingle();

      if (fallbackError) throw fallbackError;
      if (!fallbackUser) return null;

      fallbackUser.profileImageUrl = null;
      return fallbackUser;
    }
    throw error;
  }
};

module.exports.findByEmailLoose = async (email) => {
  // PostgREST doesn't inherently support direct inline mutations like LOWER(TRIM()) on filters.
  // Instead, we can use Supabase's lower-level raw text filters to query cleanly.
  const cleansedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("user")
    .select("userId, email")
    .ilike("email", cleansedEmail) // Case-insensitive matching
    .maybeSingle();

  if (error) throw error;
  return data || null;
};

module.exports.setPasswordResetToken = async (userId, token, expiresAt) => {
  const { error } = await supabase
    .from("user")
    .update({ passwordResetToken: token, passwordResetExpires: expiresAt })
    .eq("userId", userId);

  if (error) throw error;
};

module.exports.findByPasswordResetToken = async (token) => {
  const { data, error } = await supabase
    .from("user")
    .select("userId, email, password, passwordResetExpires")
    .eq("passwordResetToken", token)
    .maybeSingle();

  if (error) throw error;
  return data || null;
};

module.exports.clearPasswordResetToken = async (userId) => {
  const { error } = await supabase
    .from("user")
    .update({ passwordResetToken: null, passwordResetExpires: null })
    .eq("userId", userId);

  if (error) throw error;
};

module.exports.updatePassword = async (userId, hashedPassword) => {
  const { error } = await supabase
    .from("user")
    .update({ password: hashedPassword })
    .eq("userId", userId);

  if (error) throw error;
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

  const updatePayload = {};

  if (firstName !== undefined)
    updatePayload.firstName = firstName?.trim() || null;
  if (lastName !== undefined) updatePayload.lastName = lastName?.trim() || null;
  if (phoneNumber !== undefined)
    updatePayload.phoneNumber = phoneNumber?.trim() || null;
  if (zipCode !== undefined) updatePayload.zipCode = zipCode?.trim() || null;
  if (country !== undefined) updatePayload.country = country || null;
  if (birthDate !== undefined) updatePayload.birthDate = birthDate || null;

  if (profileImageUrl !== undefined) {
    if (profileImageUrl && profileImageUrl.length > PROFILE_IMAGE_MAX) {
      const err = new Error("PROFILE_IMAGE_TOO_LARGE");
      err.code = "PROFILE_IMAGE_TOO_LARGE";
      throw err;
    }
    updatePayload.profileImageUrl = profileImageUrl || null;
  }

  if (Object.keys(updatePayload).length === 0) {
    return module.exports.getPublicUserById(userId);
  }

  const { error } = await supabase
    .from("user")
    .update(updatePayload)
    .eq("userId", userId);

  if (error) throw error;

  return module.exports.getPublicUserById(userId);
};
