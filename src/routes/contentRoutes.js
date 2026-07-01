const express = require("express");

const router = express.Router();

const contentController = require("../controllers/contentController");

console.log("CONTENT ROUTES LOADED");

router.get("/:id", contentController.get);

module.exports = router;