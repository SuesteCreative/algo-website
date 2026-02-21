const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

module.exports = function () {
    let settings = {};
    let about = {};

    try {
        const settingsPath = path.join(__dirname, "../content/settings/general.yml");
        const fileContents = fs.readFileSync(settingsPath, "utf8");
        settings = yaml.load(fileContents);
    } catch (e) {
        console.error("Error loading settings from YAML:", e);
    }

    try {
        const aboutPath = path.join(__dirname, "../content/settings/about.yml");
        const aboutContents = fs.readFileSync(aboutPath, "utf8");
        about = yaml.load(aboutContents);
    } catch (e) {
        console.error("Error loading about from YAML:", e);
    }

    return {
        ...settings,
        about: about,
        currentYear: new Date().getFullYear(),
        siteUrl: "https://algoatelier.netlify.app",
        siteName: "Algo Atelier"
    };
};
