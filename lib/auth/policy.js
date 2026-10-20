/**
 * Keep the authorization decision pure so it can be tested independently of
 * Neon Auth and reused at every server-side admin boundary.
 */
function isAdminUser(userId, configuredAdminUserId) {
  if (typeof userId !== "string" || typeof configuredAdminUserId !== "string") {
    return false;
  }

  const adminUserId = configuredAdminUserId.trim();

  return adminUserId.length > 0 && userId === adminUserId;
}

module.exports = { isAdminUser };
