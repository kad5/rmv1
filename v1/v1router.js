const { Router } = require("express");
const authRouter = require("./auth/routes");
const adminRoutes = require("./admin/routes");
const managementRouter = require("./management/routes");
const contentRouter = require("./content/routes");
const userRouter = require("./user/routes");

const router = Router();

//v1 routes

router.use("/auth", authRouter);
router.use("/admin", adminRoutes);
router.use("/management", managementRouter);
router.use("/content", contentRouter);
router.use("/user", userRouter);

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});
module.exports = router;
