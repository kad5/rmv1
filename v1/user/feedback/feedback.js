const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const addFeedback = asyncHandler(async (req, res) => {
  const { profileId } = req.user;
  const { targetId, targetType, evaluation } = req.body;

  const validTypes = ["COURSE_CONTENT", "EXAM"];
  if (!validTypes.includes(targetType)) {
    return res.status(400).json({ message: "Invalid data, please try again" });
  }
  const evalNum = Number(evaluation);
  if (!targetId || !targetType || evalNum < 1 || evalNum > 5) {
    return res.status(400).json({ message: "Invalid data, please try again" });
  }

  const added = await prisma.feedback.upsert({
    where: {
      profileId_targetId_targetType: { profileId, targetId, targetType },
    },
    update: { evaluation: evalNum },
    create: { profileId, targetId, targetType, evaluation: evalNum },
  });
  if (!added) throw new Error("Unable to do this at the moment");
  return res.status(200).json({ message: "Thank you for your feedback 😊" });
});

//average feeback per item later

module.exports = { addFeedback };
