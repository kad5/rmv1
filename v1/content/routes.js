const { Router } = require("express");
const maindb = require("./dashbaords/main-db");
const coursedb = require("./dashbaords/course-db");
const examdb = require("./dashbaords/exam-db");
const lesson = require("./courses/lessonPage");
const lqProgress = require("./courses/progress");
const casesPg = require("./courses/specific/cases-progress");

const { validateAccessToken, protectedAccess } = require("../auth/mw");

const router = Router();

router.use(validateAccessToken);
// api/v1/content

// dashboards for a course or exam bank
router.get("/dashboard/main", maindb.getMainDashboard);
router.get(
  "/dashboard/courses/:courseId",
  protectedAccess("courseId"),
  coursedb.getCourseDb
);
router.get(
  "/dashboard/exams/:examId",
  protectedAccess("examId"),
  examdb.getExamDb
);

//  courses lessons & quiz pages and exam main page
router.get(
  "/courses/:courseId/lesson/:lessonId",
  protectedAccess("courseId"),
  lesson.getLessonPage
);
router.get(
  "/courses/:courseId/quiz/:quizId",
  protectedAccess("courseId"),
  lesson.getLessonPage
);

router.get(
  "/exams/exam/:examId",
  protectedAccess("examId"),
  lesson.getLessonPage
);

// completion for courses lesson or quiz & cases
router.post(
  "/progress/courses/:courseId/lesson/:lessonId",
  protectedAccess("courseId"),
  lqProgress.toggleProgress
);

//case
router.post(
  "/progress/courses/:courseId/cases/:caseId",
  protectedAccess("courseId"),
  casesPg.toggleCaseProgress
);

// completion for exams

module.exports = router;
