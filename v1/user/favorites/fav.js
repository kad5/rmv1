const prisma = require("../../config/prisma");

const toggleFavorite = async (req, res) => {
  try {
    const { type, providerId, targetId } = req.body;
    const userId = req.user.id;

    if (!type || !providerId || !targetId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if the favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_type_targetId: { userId, type, targetId },
      },
    });

    if (existingFavorite) {
      // If exists, remove it
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      return res.status(200).json({ message: "Favorite removed." });
    } else {
      // Otherwise, add it
      const newFavorite = await prisma.favorite.create({
        data: { userId, type, providerId, targetId },
      });
      return res.status(201).json(newFavorite);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling favorite", error: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });

    res.status(200).json(favorites);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { type, targetId } = req.body;
    const userId = req.user.id;

    const deletedFavorite = await prisma.favorite.deleteMany({
      where: { userId, type, targetId },
    });

    if (deletedFavorite.count === 0) {
      return res.status(404).json({ message: "Favorite not found." });
    }

    res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing favorite", error: error.message });
  }
};

module.exports = { toggleFavorite, getFavorites, removeFavorite };
