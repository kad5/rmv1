const { prisma } = require("../config/prisma");

const createNewUser = async (email, password, name) => {
  try {
    return await prisma.user.create({ data: { email, password, name } });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to create new user");
  }
};

const getUserById = async (userId) => {
  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to fetch user");
  }
};

const getUserByEmail = async (email) => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to fetch user");
  }
};

const addRefreshToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  console.log("token added");
  try {
    return await prisma.refreshToken.upsert({
      where: { userId },
      update: {
        token,
        expiresAt,
      },
      create: {
        userId,
        token,
        expiresAt,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to add refresh token");
  }
};

const checkRefreshToken = async (token) => {
  console.log("token checked");
  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!storedToken) return null;
    if (new Date(storedToken.expiresAt) < new Date()) {
      await deleteRefreshToken(token);
      return null;
    }
    return storedToken;
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to check refresh token");
  }
};

const deleteRefreshToken = async (token) => {
  console.log("token deleted");
  try {
    return await prisma.refreshToken.deleteMany({ where: { token } });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to delete refresh token");
  }
};

module.exports = {
  createNewUser,
  getUserById,
  getUserByEmail,
  addRefreshToken,
  checkRefreshToken,
  deleteRefreshToken,
};
