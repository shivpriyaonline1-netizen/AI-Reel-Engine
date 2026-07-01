const { chromium } = require("playwright");
const path = require("path");

exports.capture = async (htmlFile, outputFile) => {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({
        viewport: {
            width: 1080,
            height: 1920
        }
    });

    await page.goto("file://" + path.resolve(htmlFile));

    await page.screenshot({
        path: outputFile,
        type: "png"
    });

    await browser.close();

};