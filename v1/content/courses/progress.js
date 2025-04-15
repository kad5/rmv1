const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const addCourseProgress = asyncHandler(async (req, res) => {
  const profileId = req.user.profileId;
  const { courseId, lessonId } = req.params;
  const added = await prisma.courseProgress.upsert({
    where: {
      profileId_courseId_courseContnetId: {
        profileId,
        courseId,
        courseContnetId: lessonId,
      },
    },
    update: {},
    create: { profileId, courseId, courseContnetId: lessonId },
  });
  if (!added) throw new Error("Unable to update progress at the moment");
  return res.status(200).json({ message: "Marked as completed" });
});

const deleteCourseProgress = asyncHandler(async (req, res) => {
  const profileId = req.user.profileId;
  const { courseId, lessonId } = req.params;
  const deleted = await prisma.courseProgress.deleteMany({
    where: {
      profileId,
      courseId,
      courseContnetId: lessonId,
    },
  });
  if (deleted.count === 0) {
    return res.status(404).json({ message: "No progress found to delete" });
  }
  return res.status(200).json({ message: "Marked as incomplete" });
});

const addCaseProgress = asyncHandler(async (req, res) => {
  const profileId = req.user.profileId;
  const { courseId, caseId } = req.params;
  const added = await prisma.caseProgress.upsert({
    where: {
      profileId_courseId_caseId: {
        profileId,
        courseId,
        caseId: caseId,
      },
    },
    update: {},
    create: { profileId, courseId, caseId: caseId },
  });
  if (!added) throw new Error("Unable to update progress at the moment");
  return res.status(200).json({ message: "Success" });
});

module.exports = { addCourseProgress, deleteCourseProgress, addCaseProgress };
