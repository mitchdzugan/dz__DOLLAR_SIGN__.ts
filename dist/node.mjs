import * as nodeFs from "node:fs/promises";

//#region src/node.ts
async function imageToBase64DataUrl(filePath, mimeType) {
	const fileData = await fs.readFile(filePath);
	const base64Image = Buffer.from(fileData).toString("base64");
	const dataUrl = `data:${mimeType};base64,${base64Image}`;
	return dataUrl;
}
const fs = {
	...nodeFs,
	imageToBase64DataUrl
};

//#endregion
export { fs };