import * as nodeFs from "node:fs/promises";
//#region src/node.ts
async function imageToBase64DataUrl(filePath, mimeType) {
	const fileData = await fs.readFile(filePath);
	return `data:${mimeType};base64,${Buffer.from(fileData).toString("base64")}`;
}
async function exists(path) {
	try {
		await fs.access(path);
		return true;
	} catch (err) {
		return false;
	}
}
const fs = {
	...nodeFs,
	imageToBase64DataUrl,
	exists,
	readString: (p) => fs.readFile(p, "utf-8")
};
//#endregion
export { fs };
