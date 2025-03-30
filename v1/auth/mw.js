const jwt = require("jsonwebtoken");
const queries = require("./queries");
const asyncHandler = require("express-async-handler");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "2m",
  });
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
    return res.status(401).json({ message: "Unauthorized, new login needed" });

  try {
    const storedToken = await queries.checkRefreshToken(refreshToken);
    if (!storedToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized, new login needed" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Unauthorized, new login needed" });
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens(decoded.userId);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      res.setHeader("x-new-access-token", accessToken);

      req.user = { id: decoded.userId };
      return next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const protectedAccess = (productId) =>
  asyncHandler(async (req, res, next) => {
    const userId = req.user;
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

    if (!productAccess || productAccess.subscriptionEnd < now) {
      return res
        .status(403)
        .json({ message: "Access to this product has expired or is invalid" });
    }

    // Attach accessible products to req for downstream use
    req.user.accessibleProducts = accessibleProducts;
    next();
  });

module.exports = { generateTokens, validateAccessToken, protectedAccess };
