const { Router } = require("express");
const ctrl = require("./controller");
const validate = require("./validation");
const { validateAccessToken } = require("../auth/mw");
const router = Router();

router.get("/overview", validateAccessToken, ctrl.dashboardData);

//router.post settings ....

module.exports = router;
