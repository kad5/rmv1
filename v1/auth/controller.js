const asyncHandler = require("express-async-handler");
const argon2 = require("argon2");
const queries = require("./queries");
const { generateTokens } = require("./mw");
const { transporter } = require("../config/nodemailer");

const sendTokens = async (res, user) => {
  const { accessToken, refreshToken } = await generateTokens(
    user.id,
    user.activatedAccount,
    user.profileId
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return res.status(200).json({
    name: user.name,
    email: user.email,
    verified: user.activatedAccount,
    accessToken,
  });
};

const signupEmail = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const isTaken = await queries.getUserByEmail(email);
  if (isTaken)
    return res.status(409).json({ message: "This email is already taken" });

  const hashedPassword = await argon2.hash(password);
  const { user, token } = await queries.createNewUser(
    email,
    hashedPassword,
    name
  );
  const verificationEmail = await accountVerificationEmail(user, token);
  if (!verificationEmail)
    return res
      .status(500)
      .json({ message: "Internal server error, please try again later" });
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
    id: req.user?.id,
    email: req.user?.email,
    name: req.user?.name,
  });
});

/*------------------------------- verification logic -------------------------------*/
const accountVerificationEmail = async (user, token) => {
  const verificationEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f8f8; color: #333;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 20px;">
            <table role="presentation" style="width: 600px; background-color: #ffffff; border-radius: 10px; border: 1px solid #ddd;">
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #1a73e8; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                  <h1 style="font-size: 24px; color: white; border-bottom: 1px solid gray; padding-bottom: 1rem; margin-bottom: 2rem;">Only one step left to get started!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="font-size: 1.25rem;">Verify your account:</p>
                  <p>
                    <a href="${process.env.FRONTEND_URL}/verifyAccount?token=${token.token}" style="display: inline-block; border: 1px solid gray; padding: 0.5rem 3rem; color: snow; background: #333; text-decoration: none; border-radius: 5px;">
                      Click here
                    </a>
                  </p>
                  <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    This link will expire in <b>24 hours</b>. You would need to log in and request another verification link if you do not verify your account within time.
                  </p>
                  <p style="font-size: 14px; color: #777;">
                    If you did not sign up for an account, please ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                  <p><strong>RadiologyMap.com</strong></p>
                  <p>Your path to FRCR success</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  try {
    await transporter.sendMail({
      from: process.env.NM_EMAIL,
      to: user.email,
      subject: "Account Verification",
      html: verificationEmailHtml,
    });
    return true;
  } catch (err) {
    console.log("error sending email", err);
    return false;
  }
};

const requestAccountVerification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const token = await queries.createVerificationToken(
    userId,
    "ACCOUNT_CREATION"
  );
  const user = await queries.getUserById(userId);
  const verificationEmail = await accountVerificationEmail(user, token);
  if (!verificationEmail)
    return res
      .status(500)
      .json({ message: "Internal server error, please try again later" });
  return res.status(200).json({ message: "Verification email sent" });
});

const verifyAccount = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const activationToken = await queries.findVerificationToken(token);
  if (!activationToken) {
    return res.status(400).json({
      message: "Invalid or expired activation code, please request another",
    });
  }
  const activated = await queries.activateAccount(activationToken);
  if (!activated)
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  const userId = activationToken.userId;
  const user = await queries.getUserById(userId);
  return await sendTokens(res, user);
});

// password reset request
// password reset response

/*------------------------------- user object hyddration -------------------------------*/
const getUserData = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await queries.getUserById(userId);
  return res.status(200).json({
    name: user.name,
    email: user.email,
    verified: user.activatedAccount,
  });
});

/*---------------------------------------------------------------------------------------*/

module.exports = {
  signupEmail,
  loginEmail,
  authGoogle,
  authApple,
  authTwitter,
  logout,
  verifyAccount,
  requestAccountVerification,
  getUserData,
};
