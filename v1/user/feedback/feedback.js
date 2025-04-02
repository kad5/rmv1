const { prisma } = require("../../config/prisma");

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
const getFeedback = async (req, res) => {
  try {
    const { targetId, targetType } = req.query;
    const userId = req.user.id;

    const feedback = await prisma.feedback.findUnique({
      where: { userId_targetId_targetType: { userId, targetId, targetType } },
    });

    res.json(feedback || null); // Return `null` if no feedback
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching feedback", error: error.message });
  }
};

module.exports = { getFeedback, upsertFeedback };
