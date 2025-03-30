const { prisma } = require("../config/prisma");

const createNewUser = async (
  email,
  password,
  name = null,
  provider = "EMAIL"
) => {
  try {
    return await prisma.user.create({
      data: { email, password, name, provider },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to create new user");
  }
};

const createNewSocialUser = async (provider, providerId, email, name) => {
  try {
    return await prisma.user.create({
      data: { provider, providerId, email, name },
    });
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

const getUserByProvider = async (provider, providerId) => {
  try {
    return await prisma.user.findUnique({
      where: { provider_providerId: { provider, providerId } },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to find user");
  }
};

const getSubList = async (userId) => {
  try {
    return prisma.subscription.findMany({
      where: {
        userId,
        status: { in: ["ACTIVE_INITIAL", "ACTIVE_MONTHLY"] },
      },
      select: {
        subscriptionEnd: true,
        package: {
          select: {
            products: {
              select: {
                product: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to get products list");
  }
};

/* ------------------- refresh token logic -------------------*/

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
  getSubList,
  addRefreshToken,
  checkRefreshToken,
  deleteRefreshToken,
  getUserByProvider,
  createNewSocialUser,
};
