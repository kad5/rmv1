const asyncHandler = require("express-async-handler");
const adminQueries = require("./queries");

const adminController = {
  //products
  getAllProducts: asyncHandler(async (req, res) => {
    const products = await adminQueries.getAllProducts();
    res.json(products);
  }),

  getProductById: asyncHandler(async (req, res) => {
    const product = await adminQueries.getProductById(req.params.id); //uses req params
    product
      ? res.json(product)
      : res.status(404).json({ message: "Product not found" });
  }),

  createProduct: asyncHandler(async (req, res) => {
    const newProduct = await adminQueries.createProduct(req.body);
    res.status(201).json(newProduct);
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const updatedProduct = await adminQueries.updateProduct(
      req.params.id,
      req.body
    );
    res.json(updatedProduct);
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    await adminQueries.deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  }),

  //packages
  getAllPackages: asyncHandler(async (req, res) => {
    const packages = await adminQueries.getAllPackages();
    res.json(packages);
  }),

  getPackageById: asyncHandler(async (req, res) => {
    const package = await adminQueries.getPackageById(req.params.id);
    package
      ? res.json(package)
      : res.status(404).json({ message: "Package not found" });
  }),

  createPackage: asyncHandler(async (req, res) => {
    const newPackage = await adminQueries.createPackage(req.body);
    res.status(201).json(newPackage);
  }),

  updatePackage: asyncHandler(async (req, res) => {
    const updatedPackage = await adminQueries.updatePackage(
      req.params.id,
      req.body
    );
    res.json(updatedPackage);
  }),

  deletePackage: asyncHandler(async (req, res) => {
    await adminQueries.deletePackage(req.params.id);
    res.json({ message: "Package deleted" });
  }),
  // subscriptions
  getAllSubscriptions: asyncHandler(async (req, res) => {
    const subscriptions = await adminQueries.getAllSubscriptions();
    res.json(subscriptions);
  }),

  getUserSubscriptions: asyncHandler(async (req, res) => {
    const subscriptions = await adminQueries.getUserSubscriptions(
      req.params.id
    );
    res.json(subscriptions);
  }),

  getSubscriptionById: asyncHandler(async (req, res) => {
    const subscription = await adminQueries.getSubscriptionById(req.params.id);
    subscription
      ? res.json(subscription)
      : res.status(404).json({ message: "Subscription not found" });
  }),

  updateSubscription: asyncHandler(async (req, res) => {
    const updatedSubscription = await adminQueries.updateSubscription(
      req.params.id,
      req.body
    );
    res.json(updatedSubscription);
  }),
};

module.exports = adminController;
