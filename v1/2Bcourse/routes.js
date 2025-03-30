const { Router } = require("express");
const ctrl = require("./controller");
const validate = require("./validation");

const router = Router();

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
