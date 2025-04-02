const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const toggleProgress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId, lessonId } = req.params; // From route params
  const type = "LESSON";

  // Input validation
  if (!courseId || !lessonId) {
    return res.status(400).json({ message: "Missing courseId or lessonId" });
  }

  // Fetch progressId
  const progress = await prisma.progress.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!progress) {
    return res.status(404).json({ message: "User progress not found" });
  }
  const progressId = progress.id;

  // Check current state
  const existingProgress = await prisma.lessonProgress.findUnique({
    where: {
      progressId_courseId_lessonId_type: {
        progressId,
        courseId,
        lessonId,
        type,
      },
    },
    select: { completed: true }, // Only need completed field
  });

  const newCompleted = existingProgress ? !existingProgress.completed : true;
  const completedAt = newCompleted ? new Date() : null;

  // Upsert to toggle
  const updatedProgress = await prisma.lessonProgress.upsert({
    where: {
      progressId_courseId_lessonId_type: {
        progressId,
        courseId,
        lessonId,
        type,
      },
    },
    update: {
      completed: newCompleted,
      completedAt,
    },
    create: {
      progressId,
      courseId,
      lessonId,
      type,
      completed: true,
      completedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    data: updatedProgress,
    message: `Lesson marked as ${newCompleted ? "completed" : "incomplete"}`,
  });
});

module.exports = { toggleProgress };
