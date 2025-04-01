const { prisma } = require("../../config/prisma");

const getMainDashboard = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      provider: true,
      email: true,
      name: true,
      subscriptions: {
        select: {
          id: true,
          packageId: true,
          status: true,
          startDate: true,
          initialPeriodEnd: true,
          nextBillingDate: true,
          subscriptionEnd: true,
          renewalCost: true,
          autoRenew: true,
          package: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              renewalCost: true,
              duration: true,
              products: {
                select: {
                  product: {
                    select: {
                      id: true,
                      title: true,
                      description: true,
                      step: true,
                      contentType: true,
                      totalItems: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      Progress: {
        select: {
          id: true,
          lessonProgress: {
            select: {
              courseId: true,
              lessonId: true,
              type: true,
              completed: true,
              completedAt: true,
            },
          },
          examAttempts: {
            select: {
              examBankId: true,
              examId: true,
              score: true,
              attemptedAt: true,
              durationSeconds: true,
            },
            distinct: ["examId"],
          },
        },
      },
      preferences: {
        select: {
          id: true,
          productId: true,
          key: true,
          value: true,
          updatedAt: true,
        },
      },
    },
  });
  return user;
};

module.exports = { getMainDashboard };
