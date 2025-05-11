const express = require("express");
const router = express.Router();
const {authenticateUser} = require("../middlewares/auth.middleware");

const user = require("./users.route");
const income = require("./income.route");
const expenses = require("./expenses.route");
const dashboard = require("./dashboard.route")

router.use("/user", user);
router.use("/income", authenticateUser, income);
router.use("/expense", authenticateUser, expenses);
router.use("/dashboard", authenticateUser, dashboard);


module.exports = router;
