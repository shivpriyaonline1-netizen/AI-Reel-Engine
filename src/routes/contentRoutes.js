const express = require("express");

const router = express.Router();

const contentController = require("../controllers/contentController");

router.get("/:id", contentController.get);

module.exports = router;