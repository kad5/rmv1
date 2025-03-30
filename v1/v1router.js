const { Router } = require("express");
const authRouter = require("./auth/routes");

const router = Router();

//v1 routes

router.use("/auth", authRouter);

module.exports = router;
