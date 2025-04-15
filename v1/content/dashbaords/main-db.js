const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");
const { getSubList } = require("../../auth/queries");

const mainDashboardData = asyncHandler(async (req, res) => {
  const subscriptionsList = await getSubList(req.user.id);
  if (!subscriptionsList)
    return res.status(500).json({
      message:
        "Oops, the website is experiencing issues at the moment. Please try again later.",
    });

  const flattenedProducts = subscriptionsList.flatMap((subscription) =>
    subscription.package.products.map((productPackage) => ({
      ...productPackage.product,
      subscriptionEnd: subscription.subscriptionEnd,
    }))
  );

  const userProgress = await getUserProgress(
    req.user.profileId,
    flattenedProducts
  );
  if (!userProgress)
    return res.status(500).json({
      message:
        "Oops, the website is experiencing issues at the moment. Please try again later.",
    });

  return res.status(200).json(userProgress);
});

const getUserProgress = async (profileId, products) => {
  const courseIds = products
    .filter((p) => p.contentType === "COURSE")
    .map((p) => p.id);
  const examIds = products
    .filter((p) => p.contentType === "EXAM_BANK")
    .map((p) => p.id);

  const [courseProgress, examProgress] = await Promise.all([
    getCourseProgress(profileId, courseIds),
    getExamProgress(profileId, examIds),
  ]);

  const courseProgressMap = new Map();
  courseProgress.forEach((p) => {
    const current = courseProgressMap.get(p.courseId) || 0;
    courseProgressMap.set(p.courseId, current + 1);
  });

  const examProgressMap = new Map();
  examProgress.forEach((p) => {
    if (!examProgressMap.has(p.examBankId)) {
      examProgressMap.set(p.examBankId, new Set());
    }
    examProgressMap.get(p.examBankId).add(p.examId);
  });

  return products.map((product) => {
    const { id, contentType, _count } = product;

    let courseProgressCount = 0;
    let courseTotal = 0;
    let examProgressCount = 0;
    let examTotal = 0;

    if (contentType === "COURSE") {
      courseProgressCount = courseProgressMap.get(id) || 0;
      courseTotal = _count.courseContent || 0;
    }

    if (contentType === "EXAM_BANK") {
      examProgressCount = examProgressMap.get(id)?.size || 0;
      examTotal = _count.exams || 0;
    }

    const courseCompletionPercent =
      courseTotal > 0
        ? Math.round((courseProgressCount / courseTotal) * 100)
        : 0;

    const examCompletionPercent =
      examTotal > 0 ? Math.round((examProgressCount / examTotal) * 100) : 0;

    return {
      ...product,
      courseProgressCount,
      courseTotal,
      courseCompletionPercent,
      examProgressCount,
      examTotal,
      examCompletionPercent,
    };
  });
};

const getCourseProgress = async (profileId, courseIds) => {
  try {
    if (courseIds.length === 0) return [];
    return await prisma.courseProgress.findMany({
      where: {
        profileId,
        courseId: { in: courseIds },
        //completed: true,
      },
      select: {
        courseId: true,
        courseContnetId: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching course progress");
  }
};

const getExamProgress = async (profileId, examIds) => {
  try {
    if (examIds.length === 0) return [];
    return await prisma.examAttempt.findMany({
      where: {
        profileId,
        examBankId: { in: examIds },
      },
      select: {
        examBankId: true,
        examId: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching exam progress");
  }
};

module.exports = { mainDashboardData };
