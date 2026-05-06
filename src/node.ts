import * as nodeFs from "node:fs/promises";

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
  readString: (p: string) => fs.readFile(p, "utf-8"),
};
