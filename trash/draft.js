// /api/v1/courses/router.js
const express = require("express");
const router = express.Router();
const { validateAccessToken, protectedAccess } = require("../auth/middleware");
const ctrl = require("./controller"); // Centralized course logic
const uniqueCtrl = require("./uniqueLogic"); // For unique product logic

router.use(validateAccessToken);

// Dynamic product ID from route
router.use("/:productId", async (req, res, next) => {
  await protectedAccess(req.params.productId)(req, res, next);
});

// Generic CRUD for lessons (or other sub-resources)
router.get("/:productId/lessons", ctrl.getLessons);
router.post("/:productId/lessons", ctrl.createLesson);
router.put("/:productId/lessons/:lessonId", ctrl.updateLesson);
router.delete("/:productId/lessons/:lessonId", ctrl.deleteLesson);

// Generic course functionality
router.get("/:productId/quiz", ctrl.getQuiz);

// Unique functionality (e.g., for product "123sa")
router.get("/123sa/special-feature", uniqueCtrl.specialFeature);

module.exports = router;

// /api/v1/courses/controller.js
const queries = require("./queries");

const getLessons = async (req, res) => {
  const lessons = await queries.getLessons(req.params.productId);
  res.json(lessons);
};

const createLesson = async (req, res) => {
  const lesson = await queries.createLesson(req.params.productId, req.body);
  res.status(201).json(lesson);
};

// ... other generic controllers

module.exports = { getLessons, createLesson /*, ...*/ };

// /api/v1/courses/queries.js
const prisma = require("../../prisma-client");

const getLessons = async (productId) => {
  return prisma.lesson.findMany({ where: { productId } });
};

const createLesson = async (productId, data) => {
  return prisma.lesson.create({ data: { ...data, productId } });
};

// ... other queries

module.exports = { getLessons, createLesson /*, ...*/ };

// /api/v1/courses/uniqueLogic.js (optional)
const specialFeature = async (req, res) => {
  // Unique logic for "123sa"
  res.json({ message: "Special feature for course 123sa" });
};

module.exports = { specialFeature };

// /api/v1/v1router.js
router.use("/courses", require("./courses/router"));

/*
Dynamic: :productId handles all products (e.g., /courses/123sa/lessons, /courses/456bc/quiz).
Centralized: Most logic lives in controller.js and queries.js.
Unique Logic: uniqueLogic.js handles exceptions (e.g., /courses/123sa/special-feature).
*/

//crud const express = require("express");
const router = express.Router();
const ctrl = require("./controller");

router.get("/", ctrl.getProducts);
router.post("/", ctrl.createProduct); // Add admin middleware later
router.put("/:id", ctrl.updateProduct);
router.delete("/:id", ctrl.deleteProduct);

module.exports = router;

//in v1
router.use("/products", require("./products/router"));
router.use("/packages", require("./packages/router"));
router.use("/lessons", require("./lessons/router"));
