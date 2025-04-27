const express = require("express");
const router = express.Router();

const user = require("./users.route");
const income = require("./income.route");

router.use("/user", user);
router.use("/income", income);


module.exports = router;
