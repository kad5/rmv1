const { Router } = require("express");
const ctrl = require("./controller");
const validate = require("./validation");
const { validateAccessToken, protectedAccess } = require("../auth/mw");
const router = Router();

router.use(validateAccessToken);
router.use(protectedAccess("step-2B-course"));

router.get("/dashboard/my-cards", ctrl.getDashbaord);
router.get("/dashboard/my-cases", ctrl.getDashbaord);
router.get("/dashboard/my-notes", ctrl.getDashbaord);

//move to a centralized function in main, and add course id?
router.get("/dashboard", ctrl.getDashbaord); //refrece this to a centralized query that passes course Id

router.post("/course-completion/true/:lessonId", ctrl.getDashbaord);
router.post("/course-completion/false/:lessonId", ctrl.getDashbaord);
router.post("/feedback/lesson/:lessonId", ctrl.getDashbaord);
router.get("lesson/:lessonId", ctrl.getDashbaord);

/* needed routes
dahsboard
-get 2b course progress?
-get favorite cards
-get notes
-get favorite cases
-get settings
-post complete lesson, uncomplete lesson (upsert)

lesson
-get lesson obj  - dynamic route
-get notes
-post evaluation (upsert)
-post note (upsert?)
-post complete lesson, uncomplete lesson (upsert) - same ^

quiz later


*/

module.exports = router;
