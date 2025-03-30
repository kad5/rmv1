const asyncHandler = require("express-async-handler");
const argon2 = require("argon2");
const queries = require("./queries");
const { generateTokens } = require("./mw");

const sendTokens = async (res, user) => {
  const { accessToken, refreshToken } = await generateTokens(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    accessToken,
  });
};

const signupEmail = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const isTaken = await queries.getUserByEmail(email);

  if (isTaken)
    return res.status(409).json({ message: "This email is already taken" });

  const hashedPassword = await argon2.hash(password);
  const user = await queries.createNewUser(email, hashedPassword, name);

  return sendTokens(res, user);
});

const loginEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await queries.getUserByEmail(email);

  if (!user)
    return res.status(401).json({ message: "invalid username or password" });

  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch)
    return res.status(401).json({ message: "invalid username or password" });

  return sendTokens(res, user);
});

const authApple = asyncHandler(async (req, res) => sendTokens(res, req.user));
const authGoogle = asyncHandler(async (req, res) => sendTokens(res, req.user));
const authTwitter = asyncHandler(async (req, res) => sendTokens(res, req.user));

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(400).json({ message: "You are already logged out" });

  await queries.deleteRefreshToken(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });
  return res.status(200).json({
    message: "Logged out successfully",
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
});

module.exports = {
  signupEmail,
  loginEmail,
  authGoogle,
  authApple,
  authTwitter,
  logout,
};
