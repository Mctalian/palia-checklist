export type Wiki = {
  categorymembers: (
    s: string,
    options?: { [key: string]: number | string },
  ) => Promise<WikiPage[]>;
  embeddedin: (s: string) => Promise<WikiPage[]>;
  for_each_page: (
    pages: WikiPage[],
    callback: ForEachCallback,
    options?: { [key: string]: number | string },
  ) => Promise<void>;
  listen: (callback: ListenCallback, options?: ListenOptions) => void;
};

export type WikiPage = {
  title: string;
  wikitext: string;
};

export type ListenOptions = {
  delay: string;
  filter: (p: WikiPage) => boolean;
  namespace: string;
};

export type ForEachCallback = (p: WikiPage) => string;
export type ListenCallback = (p: WikiPage) => Promise<void>;
