"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnglishVillagerPages = getEnglishVillagerPages;
exports.getEnglishVillagerWeeklyWantSubPageNames = getEnglishVillagerWeeklyWantSubPageNames;
exports.getWeeklyWantTranscludes = getWeeklyWantTranscludes;
const wiki_api_1 = require("./wiki-api");
/**
 *
 * @return {PageInCategory[]} - English pages for villagers
 */
async function getEnglishVillagerPages() {
    var _a;
    const wiki = await wiki_api_1.WikiApi.getInstance();
    const villagers = (_a = (await wiki.getPagesInCategory("Villager"))) !== null && _a !== void 0 ? _a : [];
    return villagers.filter((p) => p.title.indexOf("/") < 0);
}
/**
 *
 * @return {PageInCategory[]} - English Weekly Wants subpage names for villagers
 */
async function getEnglishVillagerWeeklyWantSubPageNames() {
    const villagers = await getEnglishVillagerPages();
    const villagerPageTitles = villagers
        .filter((p) => p.title.indexOf("/") < 0)
        .filter((p) => p.title.indexOf("Category") < 0)
        .map((p) => `${p.title}/Weekly Wants`);
    return villagerPageTitles;
}
/**
 *
 * @return {string[]} - English Weekly Wants subpage names for villagers
 */
async function getWeeklyWantTranscludes() {
    const wiki = await wiki_api_1.WikiApi.getInstance();
    const transcludedPages = (await wiki.getPagesTranscluding("Template:Weekly Wants"));
    const pageNames = transcludedPages
        .filter((p) => p.title.indexOf("/Weekly Wants") > 0)
        .map((p) => p.title);
    return pageNames;
}
//# sourceMappingURL=page-helpers.js.map