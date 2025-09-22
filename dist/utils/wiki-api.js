"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiApi = void 0;
const nodemw_1 = __importDefault(require("nodemw"));
const params_1 = require("./params");
const retry_util_1 = require("./retry-util");
const os = require("os");
const cpus = os.cpus();
class WikiApi {
    constructor(retryOptions = retry_util_1.DEFAULT_RETRY_OPTIONS) {
        this.wikiApiUrl = new URL(params_1.wikiApiUrl);
        this.retryOptions = retryOptions;
        this.client = new nodemw_1.default({
            protocol: this.wikiApiUrl.protocol.split(":")[0],
            server: this.wikiApiUrl.host,
            username: params_1.wikiUsername,
            password: params_1.wikiPassword,
            concurrency: cpus.length - 1,
        });
    }
    static async getInstance(retryOptions) {
        if (!WikiApi.wikiInstance) {
            WikiApi.wikiInstance = new WikiApi(retryOptions);
            await WikiApi.wikiInstance.login();
        }
        return WikiApi.wikiInstance;
    }
    async getPagesInCategory(category) {
        return (0, retry_util_1.retryOnRateLimit)(() => new Promise((resolve, reject) => {
            this.client.getPagesInCategory(category, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        }), `getPagesInCategory(${category})`, this.retryOptions);
    }
    async getPagesTranscluding(page) {
        return (0, retry_util_1.retryOnRateLimit)(() => new Promise((resolve, reject) => {
            this.client.getPagesTranscluding(page, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        }), `getPagesTranscluding(${page})`, this.retryOptions);
    }
    async getArticle(page) {
        return (0, retry_util_1.retryOnRateLimit)(() => new Promise((resolve, reject) => {
            this.client.getArticle(page, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        }), `getArticle(${page})`, this.retryOptions);
    }
    async getArticleInfo(title, options) {
        return (0, retry_util_1.retryOnRateLimit)(() => new Promise((resolve, reject) => {
            this.client.getArticleInfo(title, options, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        }), `getArticleInfo(${title})`, this.retryOptions);
    }
    async edit(title, content, summary, minor = true) {
        return (0, retry_util_1.retryOnRateLimit)(() => new Promise((resolve, reject) => {
            this.client.edit(title, content, summary, minor, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        }), `edit(${title})`, this.retryOptions);
    }
    async purge(titles) {
        return (0, retry_util_1.retryOnRateLimit)(() => new Promise((resolve, reject) => {
            this.client.purge(titles, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        }), `purge(${titles})`, this.retryOptions);
    }
    async login() {
        return (0, retry_util_1.retryOnRateLimit)(() => new Promise((resolve, reject) => {
            this.client.logIn((err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        }), "login", this.retryOptions);
    }
}
exports.WikiApi = WikiApi;
//# sourceMappingURL=wiki-api.js.map