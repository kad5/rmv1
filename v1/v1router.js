const { Router } = require("express");
const authRouter = require("./auth/routes");
const mainRouter = require("./main/routes");
const step2BCourseRouter = require("./2Bcourse/routes");

const router = Router();

//v1 routes

router.use("/auth", authRouter);
router.use("/dashboard", mainRouter);
router.use("/step-2B-course", step2BCourseRouter);

module.exports = router;
