const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

module.exports = function () {
    let settings = {};
    let about = {};
    let testimonials = {};
    let services = {};

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

    try {
        const testimonialsPath = path.join(__dirname, "../content/settings/testimonials.yml");
        const testimonialsContents = fs.readFileSync(testimonialsPath, "utf8");
        testimonials = yaml.load(testimonialsContents);
    } catch (e) {
        console.error("Error loading testimonials from YAML:", e);
    }

    try {
        const servicesPath = path.join(__dirname, "../content/settings/services.yml");
        const servicesContents = fs.readFileSync(servicesPath, "utf8");
        services = yaml.load(servicesContents);
    } catch (e) {
        console.error("Error loading services from YAML:", e);
    }

    return {
        ...settings,
        about: about,
        testimonials: testimonials,
        services: services,
        currentYear: new Date().getFullYear(),
        siteUrl: "https://algoatelier.pt",
        siteName: "Algo Atelier"
    };
};
