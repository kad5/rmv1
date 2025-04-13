const { prisma } = require("../config/prisma");
const { randomUUID } = require("crypto");

/*------------------------ Create User ------------------------*/

const createNewUser = async (email, password, name) => {
  try {
    const profile = await prisma.profile.create();
    const user = await prisma.user.create({
      data: { email, password, name, profileId: profile.id },
    });
    const token = await createVerificationToken(user.id, "ACCOUNT_CREATION");
    return { user, token };
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to create new user");
  }
};

const namesArray = [
  "OG McLovin",
  "Fluff Marshmallow",
  "Radiology Lover",
  "Pizza Dealer 9000",
  "Diet Bowser 1985",
];

const createNewSocialUser = async (provider, id, email, socialName) => {
  const password = `${randomUUID()}${new Date().getTime()}`;
  const name =
    socialName === null
      ? namesArray[Math.floor(Math.random() * namesArray.length)]
      : socialName;

  try {
    const providerData = {
      email,
      name,
      password,
    };
    providerData[`${provider}Id`] = id;

    const profile = await prisma.profile.create();
    return await prisma.user.create({
      data: {
        ...providerData,
        profileId: profile.id,
        activatedAccount: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Database error: Unable to create new ${provider} user`);
  }
};

/*------------------------ find User ------------------------*/

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

const getUserByProvider = async (provider, id) => {
  try {
    const whereClause = {};
    whereClause[`${provider}Id`] = id;

    return await prisma.user.findUnique({
      where: whereClause,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to find user");
  }
};
/*------------------------ change user model ------------------------*/

const updateUserProvider = async (provider, id, userId) => {
  try {
    const data = {};
    data[`${provider}Id`] = id;
    return await prisma.user.update({
      where: { id: userId },
      data: { ...data },
    });
  } catch (error) {
    console.log("failed to reconcile", provider, error);
  }
};

/*------------------------ find User sub list ------------------------*/

const getSubList = async (userId) => {
  try {
    return await prisma.subscription.findMany({
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
/*------------------------ refresh token logic ------------------------*/

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

/* ------------------- verification token logic -------------------*/

const createVerificationToken = async (userId, type) => {
  try {
    const token = `${randomUUID()}${new Date().getTime()}`.replace(/-/g, "");
    return await prisma.verificationToken.create({
      data: { userId, token, type },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to create new user");
  }
};

const findVerificationToken = async (token) => {
  try {
    const storedToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (storedToken) {
      const expirationTime = new Date(storedToken.createdAt);
      expirationTime.setHours(expirationTime.getHours() + 24);
      if (new Date() > expirationTime) {
        return null;
      }
    }
    return storedToken;
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable to find verification token");
  }
};

const activateAccount = async (token) => {
  try {
    await prisma.user.update({
      where: { id: token.userId },
      data: { activatedAccount: true },
    });
    return prisma.verificationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Unable activate account");
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
  updateUserProvider,
  createNewSocialUser,
  findVerificationToken,
  activateAccount,
};
