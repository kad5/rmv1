const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const toggleFavorite = asyncHandler(async (req, res) => {
  const { type, targetId } = req.body;
  const userId = req.user.id;
  const providerId = req.params.providerId;

  if (!type || !providerId || !targetId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const validTypes = ["CARD", "CASE", "QUESTION"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid favorite type." });
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: { userId_type_targetId: { userId, type, targetId } },
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: { id: existingFavorite.id },
    });
    res.status(200).json({ success: true, message: "Favorite removed" });
  } else {
    const newFavorite = await prisma.favorite.create({
      data: { userId, type, providerId, targetId },
    });
    res.status(201).json({ success: true, data: newFavorite });
  }
});

const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const providerId = req.params.providerId;

  const favorites = await prisma.favorite.findMany({
    where: { userId, providerId },
    orderBy: { type: "asc" },
  });

  res.status(200).json(favorites);
});

const removeFavorite = asyncHandler(async (req, res) => {
  const { type, targetId } = req.body;
  const userId = req.user.id;
  const providerId = req.params.providerId;

  if (!type || !targetId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const validTypes = ["CARD", "CASE", "QUESTION" /* add others */];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid favorite type." });
  }

  const deletedFavorite = await prisma.favorite.deleteMany({
    where: { userId, type, targetId, providerId },
  });

  if (deletedFavorite.count === 0) {
    return res.status(404).json({ message: "Favorite not found." });
  }

  res
    .status(200)
    .json({ success: true, message: "Favorite removed successfully" });
});

module.exports = { toggleFavorite, getFavorites, removeFavorite };
