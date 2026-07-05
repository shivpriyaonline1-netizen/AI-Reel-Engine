const express = require("express");

const router = express.Router();

const queueController = require("../controllers/queueController");

router.get("/", queueController.list);

router.post(
    "/start/:id",
    queueController.start
);

module.exports = router;