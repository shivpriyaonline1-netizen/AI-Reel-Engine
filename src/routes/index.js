const express = require("express");

const router = express.Router();

const renderController = require("../controllers/renderController");

const queueRoutes = require("./queueRoutes");

const contentRoutes = require("./contentRoutes");

const dashboardRoutes = require("./dashboard");

router.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AI Reel Engine Running"
    });

});

router.post("/render", renderController.render);

router.use("/queue", queueRoutes);

router.use("/content", contentRoutes);

router.use("/", dashboardRoutes);

module.exports = router;