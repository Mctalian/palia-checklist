"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiApi = void 0;
const nodemw_1 = __importDefault(require("nodemw"));
const params_1 = require("./params");
const os = require("os");
const cpus = os.cpus();
class WikiApi {
    constructor() {
        this.wikiApiUrl = new URL(params_1.wikiApiUrl);
        this.client = new nodemw_1.default({
            protocol: this.wikiApiUrl.protocol.split(":")[0],
            server: this.wikiApiUrl.host,
            username: params_1.wikiUsername,
            password: params_1.wikiPassword,
            concurrency: cpus.length - 1,
        });
    }
    static async getInstance() {
        if (!WikiApi.wikiInstance) {
            WikiApi.wikiInstance = new WikiApi();
            await WikiApi.wikiInstance.login();
        }
        return WikiApi.wikiInstance;
    }
    async getPagesInCategory(category) {
        return new Promise((resolve, reject) => {
            this.client.getPagesInCategory(category, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    async getPagesTranscluding(page) {
        return new Promise((resolve, reject) => {
            this.client.getPagesTranscluding(page, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    async getArticle(page) {
        return new Promise((resolve, reject) => {
            this.client.getArticle(page, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    async getArticleInfo(title, options) {
        return new Promise((resolve, reject) => {
            this.client.getArticleInfo(title, options, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    async edit(title, content, summary, minor = true) {
        return new Promise((resolve, reject) => {
            this.client.edit(title, content, summary, minor, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    async purge(titles) {
        return new Promise((resolve, reject) => {
            this.client.purge(titles, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    async login() {
        return new Promise((resolve, reject) => {
            this.client.logIn((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}
exports.WikiApi = WikiApi;
//# sourceMappingURL=wiki-api.js.map