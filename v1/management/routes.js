const { Router } = require("express");
const { validateAccessToken, adminAuthMW } = require("../auth/mw");
const lsCtrl = require("./lesson");
const cardCtrl = require("./card");
const caseCtrl = require("./case");
const router = Router();

// api/v1/mamangement

router.use(validateAccessToken);
router.use(adminAuthMW);

// lesson
router.post("/lessons", lsCtrl.createLesson);
router.get("/lessons/:lessonId", lsCtrl.getLesson);
router.put("/lessons/:lessonId", lsCtrl.updateLesson);
router.delete("/lessons/:lessonId", lsCtrl.deleteLesson);

// Card Routes
router.post("/cards", cardCtrl.createCard);
router.put("cards/:cardId", cardCtrl.updateCard);
router.delete("/cards/:cardId", cardCtrl.deleteCard);
router.get("/cards/:cardId", cardCtrl.getCard);

// Case Routes
router.post("/cases", caseCtrl.createCase);
router.put("/cases/:caseId", caseCtrl.updateCase);
router.delete("/cases/:caseId", caseCtrl.deleteCase);
router.get("/cases/:caseId", caseCtrl.getCase);

module.exports = router;
