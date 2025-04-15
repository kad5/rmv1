const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const getLessonPage = asyncHandler(async (req, res) => {
  const profileId = req.user.profileId;
  const { courseId, lessonId } = req.params;

  const lessonData = await getLessonPageData(profileId, courseId, lessonId);
  res.status(200).json(lessonData);
});

const getLessonPageData = async (profileId, courseId, lessonId) => {
  const lesson = await prisma.courseContnet.findUnique({
    where: { id: lessonId },
    include: {
      cards: { include: { cases: true } },
    },
  });
  if (!lesson) throw new Error("Lesson not found");

  const cardIds = lesson.cards.map((c) => c.id);
  const caseIds = lesson.cards.flatMap((c) => c.cases.map((cs) => cs.id));

  const [lessonProgress, feedback, completedCases, favorites] =
    await Promise.all([
      prisma.courseProgress.findUnique({
        where: {
          profileId_courseId_lessonId: {
            profileId,
            courseId,
            courseContnetId: lessonId,
          },
        },
        select: {
          id: true,
          //completed: true
        },
      }),
      prisma.feedback.findUnique({
        where: {
          profileId_targetId_targetType: {
            profileId,
            targetId: lessonId,
            targetType: "COURSE_CONTENT",
          },
        },
        select: { evaluation: true },
      }),
      prisma.caseProgress.findMany({
        where: {
          profileId,
          courseId,
          caseId: { in: caseIds },
          //completed: true,
        },
        select: {
          caseId: true,
          //completed: true
        },
      }),
      prisma.favorite.findMany({
        where: {
          profileId,
          OR: [
            { type: "CARD", targetId: { in: cardIds } },
            { type: "CASE", targetId: { in: caseIds } },
          ],
        },
        select: { targetId: true, type: true },
      }),
    ]);

  const favoriteCardIds = new Set(
    favorites.filter((f) => f.type === "CARD").map((f) => f.targetId)
  );
  const favoriteCaseIds = new Set(
    favorites.filter((f) => f.type === "CASE").map((f) => f.targetId)
  );
  const completedCaseIds = new Set(completedCases.map((c) => c.caseId));

  const cardsWithFlags = lesson.cards.map((card) => ({
    ...card,
    isFavorited: favoriteCardIds.has(card.id),
    cases: card.cases.map((cs) => ({
      ...cs,
      isFavorited: favoriteCaseIds.has(cs.id),
      isCompleted: completedCaseIds.has(cs.id),
    })),
  }));

  return {
    lesson: {
      ...lesson,
      cards: cardsWithFlags,
    },
    isCompleted: !!lessonProgress,
    evaluation: feedback?.evaluation ?? null,
  };
};

module.exports = { getLessonPage };
