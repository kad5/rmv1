const { Router } = require("express");
const maindb = require("./dashbaords/main-db");
const coursedb = require("./dashbaords/course-db");
const examdb = require("./dashbaords/exam-db");
const lesson = require("./courses/lessonPage");

const { validateAccessToken, protectedAccess } = require("../auth/mw");

const router = Router();

router.use(validateAccessToken);

// dashboards
router.get("/dashboard/main", maindb.getMainDashboard);
router.get("/dashboard/courses/:courseId", coursedb.getCourseDb);
router.get("/dashboard/exams/:examId", examdb.getExamDb);

//  courses :lessons and quizes
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

// exams
// exam page ..... later

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
