export type Wiki = {
  categorymembers: (
    s: string,
    options?: { [key: string]: number | string },
  ) => Promise<WikiPage[]>;
  embeddedin: (s: string) => Promise<WikiPage[]>;
  page: (title: string, options?: { [key: string]: number | string }) => Promise<WikiPage>;
  for_each_page: (
    pages: WikiPage[],
    callback: ForEachCallback,
    options?: { [key: string]: number | string },
  ) => Promise<void>;
  listen: (callback: ListenCallback, options?: ListenOptions) => void;
  login: (u: string, p: string) => Promise<void>;
};

export type WikiPage = {
  title: string;
  wikitext: string;
  pageid: number;
};

export type ListenOptions = {
  delay: string;
  filter: (p: WikiPage) => boolean;
  namespace: string;
};

export type ForEachCallback = (p: WikiPage) => string;
export type ListenCallback = (p: WikiPage) => Promise<void>;
