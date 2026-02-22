const markdownIt = require("markdown-it");
const md = markdownIt({ html: true, breaks: true });

module.exports = function (eleventyConfig) {

    // ── Filters ────────────────────────────────────────────────────
    eleventyConfig.addFilter("markdownify", (v) => v ? md.render(String(v)) : "");

    eleventyConfig.addFilter("typologyLabel", (value, lang = "pt") => {
        const map = {
            residential: { pt: "Habitação Unifamiliar", en: "Single-Family Residence" },
            collective: { pt: "Habitação Coletiva", en: "Collective Housing" },
            office: { pt: "Edifício de Escritórios", en: "Office Building" },
            experimental: { pt: "Estrutura Experimental", en: "Experimental Structure" },
            public: { pt: "Equipamento Público", en: "Public Equipment" },
            hybrid: { pt: "Edifício Híbrido", en: "Hybrid Building" },
            interiors: { pt: "Interiores", en: "Interiors" },
        };
        return map[value]?.[lang] ?? value;
    });

    eleventyConfig.addFilter("statusLabel", (value, lang = "pt") => {
        const map = {
            completed: { pt: "Concluído", en: "Completed" },
            in_progress: { pt: "Em Execução", en: "In Progress" },
            in_design: { pt: "Em Projeto", en: "In Design" },
            licensing: { pt: "Em Licenciamento", en: "Licensing" },
        };
        return map[value]?.[lang] ?? value;
    });

    eleventyConfig.addFilter("nextProject", (collection, currentSlug) => {
        const idx = collection.findIndex(p => p.data.slug === currentSlug);
        return collection[(idx + 1) % collection.length];
    });

    eleventyConfig.addFilter("nextProjectEn", (collection, currentSlugEn) => {
        const idx = collection.findIndex(p => p.data.slug_en === currentSlugEn);
        return collection[(idx + 1) % collection.length];
    });

    eleventyConfig.addFilter("limit", (array, limit) => {
        return array.slice(0, limit);
    });

    eleventyConfig.addFilter("where", (array, key, value) => {
        return array.filter(item => {
            const keys = key.split('.');
            let result = item;
            for (const k of keys) {
                result = result[k];
            }
            return result === value;
        });
    });

    // ── Collections ────────────────────────────────────────────────
    eleventyConfig.addCollection("projetos", api =>
        api.getFilteredByGlob("content/projetos/*.md")
            .sort((a, b) => (b.data.year || 0) - (a.data.year || 0))
    );

    // ── Ignores ────────────────────────────────────────────────
    eleventyConfig.ignores.add("README.md");
    eleventyConfig.ignores.add(".agent/**");
    eleventyConfig.ignores.add(".gemini/**");
    eleventyConfig.ignores.add("node_modules/**");
    eleventyConfig.ignores.add("_site/**");
    eleventyConfig.ignores.add("Algo-v2-backup/**");

    // ── Passthrough: assets & favicons ──────────────────────────
    eleventyConfig.addPassthroughCopy("assets");

    // Favicons: Public Site (Root)
    eleventyConfig.addPassthroughCopy({
        "assets/img/favicon/favicon-32x32.ico": "favicon.ico",
        "assets/img/favicon/fav-icon.svg": "favicon.svg",
        "assets/img/favicon/favicon-16x16.png": "favicon-16x16.png",
        "assets/img/favicon/favicon-32x32.png": "favicon-32x32.png",
        "assets/img/favicon/apple-touch-icon.png": "apple-touch-icon.png"
    });

    // Favicons: Back-office (/admin/)
    eleventyConfig.addPassthroughCopy({
        "assets/img/favicon/favicon-admin32x32.ico": "admin/favicon-admin.ico",
        "assets/img/fav-icon-admin.svg": "admin/favicon-admin.svg",
        "assets/img/favicon/favicon-admin-16x16.png": "admin/favicon-admin-16x16.png",
        "assets/img/favicon/favicon-admin-32x32.png": "admin/favicon-admin-32x32.png",
        "assets/img/favicon/apple-touch-icon-admin.png": "admin/apple-touch-icon-admin.png"
    });

    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("404.html");

    // Static HTML pages — passthrough as-is (Only the ones not yet converted to .njk)
    const staticDirs = ["orcamento", "legal"];
    staticDirs.forEach(d => eleventyConfig.addPassthroughCopy(d));


    // ── Config ─────────────────────────────────────────────────────
    return {
        templateFormats: ["njk", "md"],
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes",
            data: "_data",
        },
    };
};
