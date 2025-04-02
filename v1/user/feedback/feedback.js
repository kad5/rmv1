const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");
// create or update feedback
const upsertFeedback = async (req, res) => {
  try {
    const { targetId, targetType, evaluation } = req.body;
    const userId = req.user.id;

    if (!targetId || !targetType || evaluation < 1 || evaluation > 5) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Upsert: Update if exists, create if not
    const feedback = await prisma.feedback.upsert({
      where: { userId_targetId_targetType: { userId, targetId, targetType } }, // Unique constraint
      update: { evaluation },
      create: { userId, targetId, targetType, evaluation },
    });

    res.json(feedback);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving feedback", error: error.message });
  }
};

// load specific feedback
const getFeedback = asyncHandler(async (req, res) => {
  const { targetId } = req.params;
  const targetType = req.query.type;
  const userId = req.user.id;

  if (!targetType) {
    return res
      .status(400)
      .json({ message: "Missing targetType query parameter." });
  }

  const validTypes = ["LESSON", "QUIZ" /* add others */];
  if (!validTypes.includes(targetType)) {
    return res.status(400).json({ message: "Invalid targetType." });
  }

  const feedback = await prisma.feedback.findUnique({
    where: { userId_targetId_targetType: { userId, targetId, targetType } },
  });

  res.status(200).json({ success: true, data: feedback || null });
});

module.exports = { getFeedback, upsertFeedback };
