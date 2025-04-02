const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const getCourseDb = asyncHandler(async () => {
  const userId = req.user.id;
  const courseId = req.params;
  const userData = await getCourseDbData(userId, courseId);
  if (!userData)
    return res.status(500).json({
      message:
        "Opps, the website is experiencing issues at the moment, please try again later",
    });

  return res.status(200).json(userData);
});

const getCourseDbData = async (userId, courseId) => {
  try {
    return await prisma.lessonProgress.findMany({
      where: {
        Progress: { userId: userId },
        courseId: courseId,
      },
      select: {
        id: true,
        courseId: true,
        lessonId: true,
        type: true,
        completed: true,
        completedAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    throw new Error("Database query failed");
  }
};

module.exports = { getCourseDb };
