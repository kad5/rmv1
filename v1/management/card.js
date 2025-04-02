const { prisma } = require("../config/prisma");
const asyncHandler = require("express-async-handler");

const createCard = asyncHandler(async (req, res) => {
  const { lessonId, type, order, module, title, content } = req.body;

  // Validation
  if (
    !lessonId ||
    !type ||
    !Number.isInteger(order) ||
    !module ||
    !title ||
    !content
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: lessonId, type, order, module, title, content",
    });
  }

  const validTypes = ["disease_Card", "approach"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid card type" });
  }

  const card = await prisma.card.create({
    data: {
      lessonId,
      type,
      order,
      module,
      title,
      content,
    },
  });

  res.status(201).json({ success: true, data: card });
});

const updateCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { lessonId, type, order, module, title, content } = req.body;

  const cardExists = await prisma.card.findUnique({ where: { id: cardId } });
  if (!cardExists) {
    return res.status(404).json({ message: "Card not found" });
  }

  if (type) {
    const validTypes = ["disease_Card", "approach"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid card type" });
    }
  }

  const updatedCard = await prisma.card.update({
    where: { id: cardId },
    data: {
      lessonId,
      type,
      order,
      module,
      title,
      content,
    },
  });

  res.status(200).json({ success: true, data: updatedCard });
});

const deleteCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;

  const cardExists = await prisma.card.findUnique({ where: { id: cardId } });
  if (!cardExists) {
    return res.status(404).json({ message: "Card not found" });
  }

  await prisma.card.delete({
    where: { id: cardId },
  });

  res.status(200).json({ success: true, message: "Card deleted successfully" });
});

const getCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      cases: true, // Include nested cases
    },
  });

  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }

  res.status(200).json({ success: true, data: card });
});

module.exports = { createCard, updateCard, deleteCard, getCard };
