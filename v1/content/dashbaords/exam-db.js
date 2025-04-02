const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const getExamDb = asyncHandler(async () => {
  const userId = req.user.id;
  const examBankId = req.params;
  const userData = await getexamDbData(userId, examBankId);
  if (!userData)
    return res.status(500).json({
      message:
        "Opps, the website is experiencing issues at the moment, please try again later",
    });

  return res.status(200).json(userData);
});

const getExamDbData = async (userId, examBankId) => {
  try {
    return await prisma.lessonProgress.findMany({
      where: {
        Progress: { userId: userId },
        examBankId: examBankId,
      },
      select: {
        id: true,
        examBankId: true,
        examId: true,
        score: true,
        attemptedAt: true,
        durationSeconds: true,
      },
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    throw new Error("Database query failed");
  }
};

module.exports = { getExamDb };
