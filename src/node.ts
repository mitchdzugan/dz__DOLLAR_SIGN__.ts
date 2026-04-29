import * as nodeFs from "node:fs/promises";

async function imageToBase64DataUrl(filePath: string, mimeType: string) {
  const fileData = await fs.readFile(filePath);
  const base64Image = Buffer.from(fileData).toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64Image}`;
  return dataUrl;
}

export const fs = {
  ...nodeFs,
  imageToBase64DataUrl,
};
