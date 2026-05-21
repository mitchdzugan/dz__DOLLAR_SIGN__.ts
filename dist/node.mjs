import * as nodeFs from "node:fs/promises";
import * as path from "node:path";
import { mkdirp } from "mkdirp";
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
	readString: (p) => fs.readFile(p, "utf-8").catch(() => {}),
	writeString: (p, c) => mkdirp(path.dirname(p)).then(() => fs.writeFile(p, c)).catch(() => {}),
	slurp: (p) => {
		return fs.readFile(p, "utf-8").then((s) => JSON.parse(s)).catch(() => {});
	},
	spit: (p, obj) => {
		return Promise.resolve(obj).then((o) => fs.writeString(p, JSON.stringify(o))).catch(() => {});
	}
};
//#endregion
export { fs };
