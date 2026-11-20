
import jwt from "jsonwebtoken";

const COOKIE_NAME = "aia_brochure_access";
const COOKIE_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const TOKEN_EXPIRY = "180d";

const isProduction = process.env.NODE_ENV === "production";

const getSecret = () => {
  const secret = process.env.BROCHURE_ACCESS_SECRET;

  if (!secret) {
    throw new Error("BROCHURE_ACCESS_SECRET is missing");
  }

  return secret;
};

// Shared cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: COOKIE_MAX_AGE,
  path: "/",
});

// Create shared brochure access cookie
export const setBrochureAccessCookie = (res) => {
  const token = jwt.sign(
    { scope: "brochure-access" },
    getSecret(),
    {
      expiresIn: TOKEN_EXPIRY,
      algorithm: "HS256",
    }
  );

  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

// Read cookie from request headers
const getCookieValue = (req, cookieName) => {
  const cookieHeader = req.headers.cookie || "";

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) continue;

    const name = cookie.slice(0, separatorIndex).trim();
    const value = cookie.slice(separatorIndex + 1).trim();

    if (name === cookieName) {
      try {
        return decodeURIComponent(value);
      } catch {
        return null;
      }
    }
  }

  return null;
};

// Verify shared brochure access
export const hasBrochureAccess = (req) => {
  try {
    const token = getCookieValue(req, COOKIE_NAME);

    if (!token) return false;

    const decoded = jwt.verify(token, getSecret(), {
      algorithms: ["HS256"],
    });

    return (
      typeof decoded === "object" &&
      decoded !== null &&
      decoded.scope === "brochure-access"
    );
  } catch (error) {
    return false;
  }
};
