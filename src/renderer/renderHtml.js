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
        `<div id="title">${job.title}</div>`
    );

    html = html.replace(
        '<div id="subtitle"></div>',
        `<div id="subtitle">${job.overview.organization}</div>`
    );

    return html;

};