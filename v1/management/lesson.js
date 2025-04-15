const { prisma } = require("../config/prisma");
const asyncHandler = require("express-async-handler");

const createLesson = asyncHandler(async (req, res) => {
  const data = req.body;
  const lesson = await prisma.courseContnet.create({ data });
  if (lesson) return res.status(200).json(lesson);
});
/*
const createLesson = asyncHandler(async (req, res) => {
  const {
    courseId,
    order,
    orderString,
    week,
    module,
    title,
    description,
    metadata,
    tips,
    additionalResources,
  } = req.body;

  // Validation
  if (
    !courseId ||
    !Number.isInteger(order) ||
    !orderString ||
    !Number.isInteger(week) ||
    !module ||
    !title
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: courseId, order, orderString, week, module, title",
    });
  }

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      order,
      orderString,
      week,
      module,
      title,
      description, // Optional
      metadata, // Optional
      tips, // Optional
      additionalResources, // Optional
    },
  });

  res.status(201).json({ success: true, data: lesson });
});
*/
const updateLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const {
    courseId,
    order,
    orderString,
    week,
    module,
    title,
    description,
    metadata,
    tips,
    additionalResources,
  } = req.body;

  // Check if lesson exists
  const lessonExists = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });
  if (!lessonExists) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  // Update only provided fields
  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      courseId,
      order,
      orderString,
      week,
      module,
      title,
      description,
      metadata,
      tips,
      additionalResources,
    },
  });

  res.status(200).json({ success: true, data: updatedLesson });
});

const deleteLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  // Check if lesson exists
  const lessonExists = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });
  if (!lessonExists) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  await prisma.lesson.delete({
    where: { id: lessonId },
  });

  res
    .status(200)
    .json({ success: true, message: "Lesson deleted successfully" });
});

const getLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      cards: {
        include: {
          cases: true, // Nested cases
        },
      },
      Quiz: { select: { id: true } }, // Optional: Include Quiz ID only
    },
  });

  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  res.status(200).json({ success: true, data: lesson });
});

module.exports = { getLesson, deleteLesson, updateLesson, createLesson };
