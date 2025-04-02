const { Router } = require("express");
const maindb = require("./dashbaords/main-db");
const coursedb = require("./dashbaords/course-db");
const examdb = require("./dashbaords/exam-db");
const lesson = require("./courses/lessonPage");

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

// favorite cards, cases, questions

// completion for courses

// completion for exams

module.exports = router;

/*

router.get("/dashboard/my-cards", ctrl.getDashbaord);
router.get("/dashboard/my-cases", ctrl.getDashbaord);
router.get("/dashboard/my-notes", ctrl.getDashbaord);

router.post("/course-completion/true/:lessonId", ctrl.getDashbaord);
router.post("/course-completion/false/:lessonId", ctrl.getDashbaord);
router.get("lesson/:lessonId", ctrl.getDashbaord);

/* needed routes

-get favorite cards

-get favorite cases

-post complete lesson, uncomplete lesson (upsert)

*/
