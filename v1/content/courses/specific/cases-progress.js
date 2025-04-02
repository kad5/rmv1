const { prisma } = require("../../../config/prisma");
const asyncHandler = require("express-async-handler");

const toggleCaseProgress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId, caseId } = req.params; // From route params

  // Input validation
  if (!courseId || !caseId) {
    return res.status(400).json({ message: "Missing courseId or caseId" });
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
  const existingProgress = await prisma.caseProgress.findUnique({
    where: {
      progressId_courseId_caseId: { progressId, courseId, caseId },
    },
    select: { completed: true }, // Only need completed field
  });

  const newCompleted = existingProgress ? !existingProgress.completed : true;
  const completedAt = newCompleted ? new Date() : null;

  // Upsert to toggle
  const updatedProgress = await prisma.caseProgress.upsert({
    where: {
      progressId_courseId_caseId: { progressId, courseId, caseId },
    },
    update: {
      completed: newCompleted,
      completedAt,
    },
    create: {
      progressId,
      courseId,
      caseId,
      completed: true,
      completedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    data: updatedProgress,
    message: `Case marked as ${newCompleted ? "completed" : "incomplete"}`,
  });
});

module.exports = { toggleCaseProgress };
