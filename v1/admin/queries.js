const { prisma } = require("../config/prisma");

const adminQueries = {
  getAllProducts: () => prisma.product.findMany(),
  getProductById: (id) => prisma.product.findUnique({ where: { id } }),
  createProduct: (data) => prisma.product.create({ data }),
  updateProduct: (id, data) => prisma.product.update({ where: { id }, data }),
  deleteProduct: (id) => prisma.product.delete({ where: { id } }),

  getAllPackages: () => prisma.package.findMany(),
  getPackageById: (id) => prisma.package.findUnique({ where: { id } }),
  createPackage: (data) => prisma.package.create({ data }),
  updatePackage: (id, data) => prisma.package.update({ where: { id }, data }),
  deletePackage: (id) => prisma.package.delete({ where: { id } }),

  getAllSubscriptions: () => prisma.subscription.findMany(),
  getUserSubscriptions: (userId) =>
    prisma.subscription.findMany({ where: { userId } }),
  getSubscriptionById: (id) =>
    prisma.subscription.findUnique({ where: { id } }),
  createSubscription: (data) => prisma.subscription.create({ data }),
  updateSubscription: (id, data) =>
    prisma.subscription.update({ where: { id }, data }),
};

module.exports = adminQueries;
