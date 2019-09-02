const router = require("express").Router();
const propertiesRoutes = require("./properties");

router.use("/properties", propertiesRoutes); // properties routes

module.exports = router;
