const express = require("express");

const router = express.Router();

const renderController = require("../controllers/renderController");

const contentRoutes = require("./contentRoutes");
const dashboardRoutes = require("./dashboard");

// Health Check
router.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AI Reel Engine Running"
    });

});

// Render APIs
router.post("/render", renderController.render);

router.post("/render/complete", renderController.complete);

router.post("/render/fail", renderController.fail);

// Content APIs
router.use("/content", contentRoutes);

// Dashboard
router.use("/", dashboardRoutes);

module.exports = router;