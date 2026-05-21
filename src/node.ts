import * as nodeFs from "node:fs/promises";
import * as path from "node:path";
import { mkdirp } from "mkdirp";

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

export const fs = {
  ...nodeFs,
  imageToBase64DataUrl,
  exists,
  readString: (p: string) => fs.readFile(p, "utf-8").catch(() => {}),
  writeString: (p: string, c: string) =>
    mkdirp(path.dirname(p))
      .then(() => fs.writeFile(p, c))
      .catch(() => {}),
  slurp: (p: string): Promise<object | undefined> => {
    return fs
      .readFile(p, "utf-8")
      .then((s) => JSON.parse(s))
      .catch(() => {});
  },
  spit: (p: string, obj: object) => {
    return Promise.resolve(obj)
      .then((o) => fs.writeString(p, JSON.stringify(o)))
      .catch(() => {});
  },
};
