const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const getLessonPage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId, lessonId } = req.params;

  const lessonData = await getLessonPageData(userId, courseId, lessonId);
  res.status(200).json(lessonData);
});

const getLessonPageData = async (userId, courseId, lessonId) => {
  // Fetch Progress ID first
  const progress = await prisma.progress.findUnique({
    where: { userId },
    select: { id: true },
  });
  const userProgressId = progress.id;

  // Fetch Lesson with all fields and relations
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      cards: { include: { cases: true } },
      Quiz: { select: { id: true } }, // Only fetch Quiz ID
    },
  });
  if (!lesson) throw new Error("Lesson not found");

  const cardIds = lesson.cards.map((c) => c.id);
  const caseIds = lesson.cards.flatMap((c) => c.cases.map((cs) => cs.id));

  // Parallel queries for progress, feedback, cases, and favorites
  const [lessonProgress, feedback, completedCases, favorites] =
    await Promise.all([
      prisma.lessonProgress.findUnique({
        where: {
          progressId_courseId_lessonId_type: {
            progressId: userProgressId,
            courseId,
            lessonId,
            type: "LESSON",
          },
        },
        select: { completed: true, completedAt: true },
      }),
      prisma.feedback.findUnique({
        where: {
          userId_targetId_targetType: {
            userId,
            targetId: lessonId,
            targetType: "LESSON",
          },
        },
        select: { evaluation: true, createdAt: true },
      }),
      prisma.caseProgress.findMany({
        where: {
          progressId: userProgressId,
          courseId,
          caseId: { in: caseIds },
          completed: true,
        },
        select: { caseId: true, completed: true, completedAt: true },
      }),
      prisma.favorite.findMany({
        where: {
          userId,
          OR: [
            { type: "CARD", targetId: { in: cardIds } },
            { type: "CASE", targetId: { in: caseIds } },
          ],
        },
        select: { targetId: true, type: true },
      }),
    ]);

  return {
    lesson, // All Lesson fields + cards, cases, Quiz.id
    progress: lessonProgress,
    feedback,
    completedCases,
    favorites,
  };
};

module.exports = { getLessonPage };
