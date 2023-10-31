import * as Wikiapi from "wikiapi";
import { Wiki } from "./types";
import { wikiApiUrl, wikiPassword, wikiUsername } from "./params";

let wiki: Wiki;

export async function getLoggedInWiki() {
  if (wiki) {
    return wiki;
  }

  wiki = new Wikiapi(wikiApiUrl.value());
  await wiki.login(wikiUsername.value(), wikiPassword.value());
  return wiki;
}
