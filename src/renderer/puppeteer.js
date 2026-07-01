const puppeteer = require("puppeteer");
const path = require("path");

exports.capture = async (htmlFile, outputFile) => {

    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1080,
        height: 1920
    });

    await page.goto(
        "file://" + path.resolve(htmlFile),
        {
            waitUntil: "networkidle0"
        }
    );

    await page.screenshot({
        path: outputFile
    });

    await browser.close();

};