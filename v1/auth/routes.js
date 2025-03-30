const { Router } = require("express");
const passport = require("../config/passport");
const { loginLimiter, signupLimiter } = require("../config/rate-limit");
const ctrl = require("./controller");
const validate = require("./validation");

const router = Router();

router.post("/login", loginLimiter, validate.login, ctrl.loginEmail);
router.post("/signup", signupLimiter, validate.signup, ctrl.signupEmail);
router.post("/logout", ctrl.logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  ctrl.authGoogle
);

router.get("/twitter", passport.authenticate("twitter"));
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  ctrl.authTwitter
);

router.get("/apple", passport.authenticate("apple"));
router.get(
  "/apple/callback",
  passport.authenticate("apple", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  ctrl.authApple
);

module.exports = router;
