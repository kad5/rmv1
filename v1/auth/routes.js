const { Router } = require("express");
const passport = require("../config/passport");
const ctrl = require("./controller");
const validate = require("./validation");
const router = Router();

router.post("/login", ctrl.loginEmail);
router.post("/signup", ctrl.signupEmail);
router.post("/logout", ctrl.logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  ctrl.authGoogle
);

app.get("/twitter", passport.authenticate("twitter"));
app.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  ctrl.authTwitter
);

router.get("/apple", passport.authenticate("apple"));
router.get(
  "/apple/callback",
  passport.authenticate("apple", { failureRedirect: "/login" }),
  ctrl.authApple
);

module.exports = router;
