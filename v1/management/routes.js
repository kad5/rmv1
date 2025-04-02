const { Router } = require("express");
const { validateAccessToken, adminAuthMW } = require("../auth/mw");
const router = Router();

// api/v1/mamangement

router.use(validateAccessToken);
router.use(adminAuthMW);

module.exports = router;
