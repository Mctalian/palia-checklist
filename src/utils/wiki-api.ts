import Bot from "nodemw";
import {
  ArticleInfo,
  PageEditedResult,
  type PageInCategory,
} from "nodemw/lib/types";
import { wikiApiUrl, wikiPassword, wikiUsername } from "./params";
import { retryOnRateLimit, DEFAULT_RETRY_OPTIONS, type RetryOptions } from "./retry-util";

const os = require("os");
const cpus = os.cpus();

export class WikiApi {
  private static wikiInstance: WikiApi;
  private readonly client: Bot;
  private readonly wikiApiUrl: URL;
  private readonly retryOptions: RetryOptions;

  private constructor(retryOptions: RetryOptions = DEFAULT_RETRY_OPTIONS) {
    this.wikiApiUrl = new URL(wikiApiUrl);
    this.retryOptions = retryOptions;

    this.client = new Bot({
      protocol: this.wikiApiUrl.protocol.split(":")[0],
      server: this.wikiApiUrl.host,
      username: wikiUsername,
      password: wikiPassword,
      concurrency: cpus.length - 1,
    });
  }

  public static async getInstance(retryOptions?: RetryOptions): Promise<WikiApi> {
    if (!WikiApi.wikiInstance) {
      WikiApi.wikiInstance = new WikiApi(retryOptions);
      await WikiApi.wikiInstance.login();
    }
    return WikiApi.wikiInstance;
  }

  public async getPagesInCategory(category: string) {
    return retryOnRateLimit(
      () => new Promise<PageInCategory[] | undefined>((resolve, reject) => {
        this.client.getPagesInCategory(category, (err: any, results: any) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      `getPagesInCategory(${category})`,
      this.retryOptions
    );
  }

  public async getPagesTranscluding(page: string) {
    return retryOnRateLimit(
      () => new Promise<unknown | undefined>((resolve, reject) => {
        this.client.getPagesTranscluding(page, (err: any, results: any) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      `getPagesTranscluding(${page})`,
      this.retryOptions
    );
  }

  public async getArticle(page: string) {
    return retryOnRateLimit(
      () => new Promise<string | undefined>((resolve, reject) => {
        this.client.getArticle(page, (err: any, results: any) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      `getArticle(${page})`,
      this.retryOptions
    );
  }

  public async getArticleInfo(title: string, options?: any) {
    return retryOnRateLimit(
      () => new Promise<ArticleInfo[] | undefined>((resolve, reject) => {
        this.client.getArticleInfo(title, options, (err: any, results: any) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      `getArticleInfo(${title})`,
      this.retryOptions
    );
  }

  public async edit(
    title: string,
    content: string,
    summary: string,
    minor = true,
  ) {
    return retryOnRateLimit(
      () => new Promise<PageEditedResult | undefined>((resolve, reject) => {
        this.client.edit(title, content, summary, minor, (err: any, results: any) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      `edit(${title})`,
      this.retryOptions
    );
  }

  public async purge(titles: string) {
    return retryOnRateLimit(
      () => new Promise<unknown | undefined>((resolve, reject) => {
        this.client.purge(titles, (err: any, results: any) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      `purge(${titles})`,
      this.retryOptions
    );
  }

  public async login() {
    return retryOnRateLimit(
      () => new Promise<unknown | undefined>((resolve, reject) => {
        this.client.logIn((err: any, results: any) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      "login",
      this.retryOptions
    );
  }
}
