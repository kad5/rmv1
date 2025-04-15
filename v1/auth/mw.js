const jwt = require("jsonwebtoken");
const queries = require("./queries");
const asyncHandler = require("express-async-handler");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateTokens = async (userId, activatedAccount, profileId) => {
  const accessToken = jwt.sign(
    { id: userId, activatedAccount, profileId },
    ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_EXPIRY,
    }
  );
  const refreshToken = jwt.sign(
    { id: userId, activatedAccount, profileId },
    REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRY,
    }
  );
  await queries.addRefreshToken(userId, refreshToken);

  return { accessToken, refreshToken };
};

const validateAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // If somehow access token doesn't exist, try to check the refresh and issue new one
  if (!authHeader) return validateRefreshToken(req, res, next);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_SECRET, async (err, decoded) => {
    if (!err) {
      req.user = decoded;
      return next();
    }
    // If access token expired, try to refresh it
    return validateRefreshToken(req, res, next);
  });
};

const validateRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "Access denied, new login needed." });

  try {
    const storedToken = await queries.checkRefreshToken(refreshToken);
    if (!storedToken) {
      return res
        .status(401)
        .json({ message: "Access denied, new login needed." });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Access denied, new login needed." });
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens(
          decoded.id,
          decoded.activatedAccount,
          decoded.profileId
        );
      console.log("tokens being refreshed");
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      res.setHeader("x-new-access-token", accessToken);

      req.user = {
        id: decoded.id,
        activatedAccount: decoded.activatedAccount,
        profileId: decoded.profileId,
      };
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const protectedAccess = (paramName) =>
  asyncHandler(async (req, res, next) => {
    const productId = req.params[paramName];
    const userId = req.user.id;
    const subscriptions = await queries.getSubList(userId);

    // Transform into a list of accessible products with end dates
    const accessibleProducts = subscriptions.flatMap((sub) => {
      const endDate = sub.subscriptionEnd;
      return sub.package.products.map((pp) => ({
        productId: pp.product.id,
        subscriptionEnd: endDate,
      }));
    });
    // Check if the requested product is accessible and still valid
    const now = new Date();
    const productAccess = accessibleProducts.find(
      (ap) => ap.productId === productId
    );
    // remember to check if the product doesnt even exist and return a 404 perhaps on front end?
    if (!productAccess || productAccess.subscriptionEnd < now) {
      return res
        .status(403)
        .json({ message: "Access to this product has expired or is invalid" });
    }

    // Attach accessible products to req for downstream use
    req.user.accessibleProducts = accessibleProducts;
    next();
  });

const adminAuthMW = () =>
  asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    return req.user.id === process.env.ADMIN_ID
      ? next()
      : res.status(403).json({ message: "Forbidden access" });
  });

const verifiedUser = asyncHandler(async (req, res, next) => {
  const verified = req.user.activatedAccount;
  if (verified !== true)
    return res
      .status(403)
      .json({ message: "Access denied. Please verify your account" });
  next();
});

module.exports = {
  generateTokens,
  validateAccessToken,
  protectedAccess,
  adminAuthMW,
  verifiedUser,
};
