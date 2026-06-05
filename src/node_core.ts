import * as nodeFs from "node:fs/promises";
import * as nodePath from "node:path";
import { mkdirp } from "mkdirp";
import envPaths from "env-paths";
import * as $ from "./core.js";

async function imageToBase64DataUrl(filePath: string, mimeType: string) {
  const fileData = await fs.readFile(filePath);
  const base64Image = Buffer.from(fileData).toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64Image}`;
  return dataUrl;
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch (err) {
    return false;
  }
}

type PathBuilder = ((...args: string[]) => string) & {
  partial: (...args: string[]) => PathBuilder;
};

function PathBuilder(...args: string[]): PathBuilder {
  function build(...subargs: string[]) {
    return path.join(...args, ...subargs);
  }
  return Object.assign(build, {
    partial: (...subargs: string[]) => PathBuilder(...args, ...subargs),
  });
}

type AppPathBuilders = {
  config: PathBuilder;
  log: PathBuilder;
  data: PathBuilder;
  temp: PathBuilder;
  cache: PathBuilder;
};
type AppPathOpts = {
  suffix?: string;
  asDataSubdir?: Set<keyof AppPathBuilders>;
};
function AppPathBuilders(
  appName: string,
  opts: AppPathOpts = {},
): AppPathBuilders {
  const suffix = opts.suffix || "";
  const asDataSubdir = opts.asDataSubdir || new Set();
  const paths = envPaths(appName, { suffix });
  function getBuilder(k: keyof AppPathBuilders) {
    const isSubdir = asDataSubdir.has(k);
    return isSubdir ? PathBuilder(paths.data, paths[k]) : PathBuilder(paths[k]);
  }
  return {
    config: getBuilder("config"),
    log: getBuilder("log"),
    data: getBuilder("data"),
    temp: getBuilder("temp"),
    cache: getBuilder("cache"),
  };
}

export const path = {
  ...nodePath,
};

export const fs = {
  ...nodeFs,
  imageToBase64DataUrl,
  exists,
  readString: (p: string) => fs.readFile(p, "utf-8").catch(() => undefined),
  writeString: (p: string, c: string) =>
    mkdirp(path.dirname(p))
      .then(() => fs.writeFile(p, c))
      .catch(() => {}),
  slurp: <T extends Object>(p: string): Promise<T | undefined> => {
    return fs
      .readFile(p, "utf-8")
      .then((s) => $.dec(s) as unknown as T)
      .catch(() => undefined);
  },
  slurp1stCfg: async <T extends Object>(p: string): Promise<T | undefined> => {
    for (const res of $.iMaybe($.Maybe(await fs.slurp<T>(`${p}.yaml`)))) {
      return res;
    }
    for (const res of $.iMaybe($.Maybe(await fs.slurp<T>(`${p}.json`)))) {
      return res;
    }
    for (const res of $.iMaybe($.Maybe(await fs.slurp<T>(p)))) {
      return res;
    }
    return undefined;
  },
  spit: <T extends object>(p: string, obj: T) => {
    return Promise.resolve(obj)
      .then((o) => fs.writeString(p, $.enc(o)))
      .catch(() => {});
  },
  PathBuilder,
  AppPathBuilders,
};
