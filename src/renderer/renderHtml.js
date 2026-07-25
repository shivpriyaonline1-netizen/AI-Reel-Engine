const fs = require("fs");
const path = require("path");

exports.build = (job) => {

    const template = path.join(
        __dirname,
        "../templates/reel.html"
    );

    let html = fs.readFileSync(template, "utf8");

    html = html.replace(
        '<div id="title"></div>',
        `<div id="title">${job.title || ""}</div>`
    );

    const organization =
        job.overview?.Organization ||
        job.overview?.organization ||
        "";

    html = html.replace(
        '<div id="subtitle"></div>',
        `<div id="subtitle">${organization}</div>`
    );

    return html;

};