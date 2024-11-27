const express = require("express");
const authorizeRoles = require("../middlewares/authorizeRoles");

const router = express.Router();

// Admin Route
router.get("/admin", authorizeRoles(["Admin"]), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// User Route
router.get("/user", authorizeRoles(["User"]), (req, res) => {
  res.json({ message: "Welcome, User!" });
});

module.exports = router;
