const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

module.exports = function () {
    let settings = {};
    try {
        const settingsPath = path.join(__dirname, "../content/settings/general.yml");
        const fileContents = fs.readFileSync(settingsPath, "utf8");
        settings = yaml.load(fileContents);
    } catch (e) {
        console.error("Error loading settings from YAML:", e);
    }

    return {
        ...settings,
        currentYear: new Date().getFullYear(),
        siteUrl: "https://algoatelier.pt",
        siteName: "Algo Atelier"
    };
};
