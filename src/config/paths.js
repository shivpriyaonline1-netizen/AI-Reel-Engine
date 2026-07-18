const path = require("path");

module.exports = {

    STORAGE: "C:\\AI-Reel-Storage",

    QUEUE: path.join(
        "C:\\AI-Reel-Storage",
        "queue"
    ),

    STATUS: path.join(
        "C:\\AI-Reel-Storage",
        "status"
    ),

    LOGS: path.join(
        "C:\\AI-Reel-Storage",
        "logs"
    ),

    OUTPUT: path.join(
        "C:\\AI-Reel-Storage",
        "output"
    )

};