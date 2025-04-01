const prisma = require("../../config/prisma");

const upsertPreference = async (req, res) => {
  try {
    const { key, value, productId } = req.body;
    const userId = req.user.id;

    if (!key || value === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const preference = await prisma.preference.upsert({
      where: { userId_key_productId: { userId, key, productId } },
      update: { value },
      create: { userId, key, productId, value },
    });

    res.status(200).json(preference);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving preference", error: error.message });
  }
};

const getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const preferences = await prisma.preference.findMany({
      where: { userId },
    });

    res.status(200).json(preferences);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching preferences", error: error.message });
  }
};

const getPreference = async (req, res) => {
  try {
    const { key, productId } = req.params;
    const userId = req.user.id;

    const preference = await prisma.preference.findUnique({
      where: { userId_key_productId: { userId, key, productId } },
    });

    if (!preference) {
      return res.status(404).json({ message: "Preference not found." });
    }

    res.status(200).json(preference);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving preference", error: error.message });
  }
};

const deletePreference = async (req, res) => {
  try {
    const { key, productId } = req.body;
    const userId = req.user.id;

    const deletedPreference = await prisma.preference.deleteMany({
      where: { userId, key, productId },
    });

    if (deletedPreference.count === 0) {
      return res.status(404).json({ message: "Preference not found." });
    }

    res.status(200).json({ message: "Preference deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting preference", error: error.message });
  }
};

module.exports = {
  deletePreference,
  upsertPreference,
  getPreference,
  getPreferences,
};
