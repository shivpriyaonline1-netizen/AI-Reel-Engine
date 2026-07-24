module.exports = {

    appName: "AI Reel Engine",

    version: "2.0.0",

    templates: "./src/templates",

    assets: "./src/assets",

    storage: process.env.ARG_STORAGE || "C:\\AI-Reel-Storage",

    wp: {
        api: process.env.WP_API || "https://shivpriyaonline.com/wp-json/arg/v1",
        upload: process.env.WP_UPLOAD || "https://shivpriyaonline.com/wp-json/arg/v1/upload",
        apiKey: process.env.WP_API_KEY || ""
    },

    queue: {
        pending: "queue/pending",
        processing: "queue/processing",
        completed: "queue/completed",
        failed: "queue/failed"
    }

};