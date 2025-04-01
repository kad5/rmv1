const { Router } = require("express");
const authRouter = require("./auth/routes");
const adminRoutes = require("./admin/routes");
const mainRouter = require("./user/routes");
const step2BCourseRouter = require("./courses/routes");
const router = Router();

//v1 routes

router.use("/auth", authRouter);
router.use("/admin", adminRoutes);
router.use("/dashboard", mainRouter);
//router.use("/step-2B-course", step2BCourseRouter);

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});
module.exports = router;
