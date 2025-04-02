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
router.post("/courses/:courseId/lessons", lsCtrl.createLesson);
router.get("/courses/:courseId/lessons/:lessonId", lsCtrl.getLesson);
router.put("/courses/:courseId/lessons/:lessonId", lsCtrl.updateLesson);
router.delete("/courses/:courseId/lessons/:lessonId", lsCtrl.deleteLesson);

// Card Routes
router.post("/courses/:courseId/lessons/:lessonId/cards", cardCtrl.createCard);
router.put(
  "/courses/:courseId/lessons/:lessonId/cards/:cardId",
  cardCtrl.updateCard
);
router.delete(
  "/courses/:courseId/lessons/:lessonId/cards/:cardId",
  cardCtrl.deleteCard
);
router.get(
  "/courses/:courseId/lessons/:lessonId/cards/:cardId",
  cardCtrl.getCard
);

// Case Routes
router.post(
  "/courses/:courseId/lessons/:lessonId/cards/:cardId/cases",
  caseCtrl.createCase
);
router.put(
  "/courses/:courseId/lessons/:lessonId/cards/:cardId/cases/:caseId",
  caseCtrl.updateCase
);
router.delete(
  "/courses/:courseId/lessons/:lessonId/cards/:cardId/cases/:caseId",
  caseCtrl.deleteCase
);
router.get(
  "/courses/:courseId/lessons/:lessonId/cards/:cardId/cases/:caseId",
  caseCtrl.getCase
);

module.exports = router;
