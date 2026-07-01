const express = require("express");

const router = express.Router();

const renderController = require("../controllers/renderController");

const queueRoutes = require("./queueRoutes");

router.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AI Reel Engine Running"
    });

});

router.post("/render", renderController.render);

router.use("/queue", queueRoutes);

module.exports = router;