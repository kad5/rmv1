const { Router } = require("express");
const maindb = require("./dashbaords/main-db");
const coursedb = require("./dashbaords/course-db");
const examdb = require("./dashbaords/exam-db");
const lesson = require("./courses/lessonPage");
const CourseProgress = require("./courses/progress");

const { validateAccessToken, protectedAccess } = require("../auth/mw");

const router = Router();

router.use(validateAccessToken);
// api/v1/content

// dashboards for a course or exam bank
router.get("/dashboard/main", maindb.mainDashboardData);

// courses
router.get(
  "/dashboard/courses/:courseId",
  protectedAccess("courseId"),
  coursedb.getCourseDb
);

router.get(
  "/courses/:courseId/lessons/:lessonId",
  protectedAccess("courseId"),
  lesson.getLessonPage
);

// exams
router.get("/dashboard/packages/:packageId", protectedAccess("packageId"));

router.get("/packages/packageId/exams/:examId", protectedAccess("packageId"));

// progress

router.post(
  "/progress/courses/:courseId/lessons/:lessonId",
  protectedAccess("courseId"),
  CourseProgress.addCourseProgress
);
router.delete(
  "/progress/courses/:courseId/lessons/:lessonId",
  protectedAccess("courseId"),
  CourseProgress.deleteCourseProgress
);

router.post(
  "/progress/courses/:courseId/cases/:caseId",
  protectedAccess("courseId"),
  CourseProgress.addCaseProgress
);

// completion for exams

module.exports = router;
