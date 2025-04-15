const { Router } = require("express");
const adminController = require("./controller");
const { validateAccessToken, adminAuthMW } = require("../auth/mw");

const router = Router();
// api/v1/admin

router.use(validateAccessToken);
router.use(adminAuthMW);

//products crud
router.get("/products", adminController.getAllProducts);
router.get("/products/:id", adminController.getProductById);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
//packages crud
router.get("/packages", adminController.getAllPackages);
router.get("/packages/:id", adminController.getPackageById);
router.post("/packages", adminController.createPackage);
router.put("/packages/:id", adminController.updatePackage);
router.delete("/packages/:id", adminController.deletePackage);
//subscriptions crud
router.get("/subscriptions", adminController.getAllSubscriptions);
router.post("/subscriptions", adminController.createSubscription);
router.get("/subscriptions/:id", adminController.getSubscriptionById);
router.put("/subscriptions/:id", adminController.updateSubscription);

module.exports = router;
