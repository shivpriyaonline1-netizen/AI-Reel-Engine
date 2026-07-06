const express = require("express");

const router = express.Router();

const queueController = require("../controllers/queueController");

router.get("/", queueController.list);

router.post("/start/:id", queueController.start);

router.post("/complete/:id", queueController.complete);

router.post("/fail/:id", queueController.fail);

module.exports = router;