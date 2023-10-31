import Bot from "nodemw";
import { ArticleInfo, PageEditedResult, type PageInCategory } from "nodemw/lib/types";
import { wikiApiUrl, wikiPassword, wikiUsername } from "./params";

const os = require('os');
const cpus = os.cpus();

export class WikiApi {
  private static wikiInstance: WikiApi;
  private readonly client: Bot;
  private readonly wikiApiUrl: URL;

  private constructor() {
    this.wikiApiUrl = new URL(wikiApiUrl.value());

    this.client = new Bot({
      protocol: this.wikiApiUrl.protocol.split(":")[0],
      server: this.wikiApiUrl.host,
      path: this.wikiApiUrl.pathname,
      username: wikiUsername.value(),
      password: wikiPassword.value(),
      concurrency: cpus.length - 1,
    });
  }

  public static async getInstance(): Promise<WikiApi> {
    if (!WikiApi.wikiInstance) {
      WikiApi.wikiInstance = new WikiApi()
      await WikiApi.wikiInstance.login();
    }
    return WikiApi.wikiInstance;
  }

  public async getPagesInCategory(category: string) {
    return new Promise<PageInCategory[] | undefined>((resolve, reject) => {
      this.client.getPagesInCategory(category, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
    });
  }

  public async getPagesTranscluding(page: string) {
    return new Promise<unknown | undefined>((resolve, reject) => {
      this.client.getPagesTranscluding(page, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
    });
  }

  public async getArticle(page: string) {
    return new Promise<string | undefined>((resolve, reject) => {
      this.client.getArticle(page, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
    });
  }

  public async getArticleInfo(title: string, options?: any) {
    return new Promise<ArticleInfo[] | undefined>((resolve, reject) => {
      this.client.getArticleInfo(title, options, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
    });
  }

  public async edit(title: string, content: string, summary: string, minor = true) {
    return new Promise<PageEditedResult | undefined>((resolve, reject) => {
      this.client.edit(title, content, summary, minor, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
    });
  }

  public async purge(titles: string) {
    return new Promise<unknown | undefined>((resolve, reject) => {
      this.client.purge(titles, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
    });
  }

  public async login() {
    return new Promise<unknown | undefined>((resolve, reject) => {
      this.client.logIn((err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      })
    });
  }

}
