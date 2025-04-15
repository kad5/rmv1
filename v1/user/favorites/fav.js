const { prisma } = require("../../config/prisma");
const asyncHandler = require("express-async-handler");

const getFavoritesByProvider = asyncHandler(async (req, res) => {
  const { profileId } = req.user;
  const providerId = req.params.providerId;

  const favorites = await prisma.favorite.findMany({
    where: { profileId, providerId },
    orderBy: { type: "asc" },
  });

  res.status(200).json(favorites);
});

const addFavorite = asyncHandler(async (req, res) => {
  const { providerId, type, targetId } = req.params;
  const { profileId } = req.user;

  if (!type || !providerId || !targetId) {
    return res
      .status(400)
      .json({ message: "Invalid request, please try again" });
  }

  const validTypes = ["CARD", "CASE", "QUESTION"];
  if (!validTypes.includes(type)) {
    return res
      .status(400)
      .json({ message: "Invalid request, please try again" });
  }

  const added = await prisma.favorite.upsert({
    where: { profileId_type_targetId: { profileId, type, targetId } },
    update: {},
    create: { profileId, type, targetId, providerId },
  });
  if (!added) throw new Error("Unable to complete this at the moment");
  return res.status(200).json({ message: "Added to your favorites" });
});

const removeFavorite = asyncHandler(async (req, res) => {
  const { providerId, type, targetId } = req.params;
  const { profileId } = req.user;

  if (!type || !targetId) {
    return res
      .status(400)
      .json({ message: "Invalid request, please try again" });
  }

  const validTypes = ["CARD", "CASE", "QUESTION"];
  if (!validTypes.includes(type)) {
    return res
      .status(400)
      .json({ message: "Invalid request, please try again" });
  }

  const deleted = await prisma.favorite.deleteMany({
    where: { profileId, type, targetId, providerId },
  });

  if (deleted.count === 0) {
    return res.status(404).json({ message: "Favorite not found" });
  }
  res.status(200).json({ message: "Removed from favorites" });
});

module.exports = { getFavoritesByProvider, addFavorite, removeFavorite };
