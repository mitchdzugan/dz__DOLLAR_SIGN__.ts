import * as nodeFs from "node:fs/promises";
import * as path from "node:path";
import { mkdirp } from "mkdirp";
import envPaths from "env-paths";
import * as YAML from "js-yaml";
import * as SLIPPI_JS_IMP from "@slippi/slippi-js";
//#region src/core.ts
const { Character } = SLIPPI_JS_IMP.default || SLIPPI_JS_IMP;
const enc = YAML.dump;
const dec = YAML.load;
function $$(k) {
	return (obj) => obj[k];
}
function $$_(k) {
	return (obj, v) => obj[k] = v;
}
const charRecordGetter = (recName) => () => {
	const charRecord = $$(recName)(ssbmChar) || {};
	$$_(recName)(ssbmChar, charRecord);
	return charRecord;
};
const charRecordRowGetter = (recName) => (k) => charRecordGetter(recName)()[k] || SSBM.Char.Invalid;
const charRecordRowSetter = (recName) => (k, v) => charRecordGetter(recName)()[k] = v;
const setCharById = charRecordRowSetter("__charById");
const setCharBySlippiApiName = charRecordRowSetter("__charBySlippiApiName");
const getCharById = charRecordRowGetter("__charById");
const getCharBySlippiApiName = charRecordRowGetter("__charBySlippiApiName");
function buildSsbmChar(id, name, slippiApiName, opts = {}) {
	return {
		preferCSP: false,
		meleeCSPFilename: name,
		meleeCSPDirname: opts.meleeCSPFilename || name,
		id,
		name,
		slippiApiName,
		...opts
	};
}
const ssbmChar = (...args) => {
	const char = buildSsbmChar(...args);
	setCharById(char.id, char);
	setCharBySlippiApiName(char.slippiApiName, char);
	return char;
};
const SSBM = {
	GAME_FIRST_FRAME: -123,
	Char: {
		of: (id) => getCharById(id),
		ofSlippiApiName: (name) => getCharBySlippiApiName(name),
		Falcon: ssbmChar(Character.CAPTAIN_FALCON, "Captain Falcon", "CAPTAIN_FALCON"),
		DK: ssbmChar(Character.DONKEY_KONG, "Donkey Kong", "DONKEY_KONG"),
		Fox: ssbmChar(Character.FOX, "Fox", "FOX"),
		GameAndWatch: ssbmChar(Character.GAME_AND_WATCH, "Mr. Game & Watch", "GAME_AND_WATCH", { meleeCSPFilename: "Mr. Game and Watch" }),
		Kirby: ssbmChar(Character.KIRBY, "Kirby", "KIRBY"),
		Bowser: ssbmChar(Character.BOWSER, "Bowser", "BOWSER"),
		Link: ssbmChar(Character.LINK, "Link", "LINK"),
		Luigi: ssbmChar(Character.LUIGI, "Luigi", "LUIGI"),
		Mario: ssbmChar(Character.MARIO, "Mario", "MARIO"),
		Marth: ssbmChar(Character.MARTH, "Marth", "MARTH"),
		Mewtwo: ssbmChar(Character.MEWTWO, "Mewtwo", "MEWTWO"),
		Ness: ssbmChar(Character.NESS, "Ness", "NESS"),
		Peach: ssbmChar(Character.PEACH, "Peach", "PEACH"),
		Pikachu: ssbmChar(Character.PIKACHU, "Pikachu", "PIKACHU"),
		ICs: ssbmChar(Character.ICE_CLIMBERS, "Ice Climbers", "ICE_CLIMBERS", {
			meleeCSPDirname: "Ice Climbers",
			meleeCSPFilename: "Ice_Climbers"
		}),
		Puff: ssbmChar(Character.JIGGLYPUFF, "Jigglypuff", "JIGGLYPUFF"),
		Samus: ssbmChar(Character.SAMUS, "Samus", "SAMUS"),
		Yoshi: ssbmChar(Character.YOSHI, "Yoshi", "YOSHI"),
		Zelda: ssbmChar(Character.ZELDA, "Zelda", "ZELDA", { meleeCSPDirname: "Zelda and Sheik" }),
		Sheik: ssbmChar(Character.SHEIK, "Sheik", "SHEIK", { meleeCSPDirname: "Zelda and Sheik" }),
		Falco: ssbmChar(Character.FALCO, "Falco", "FALCO"),
		YLink: ssbmChar(Character.YOUNG_LINK, "Young Link", "YOUNG_LINK"),
		Doc: ssbmChar(Character.DR_MARIO, "Dr. Mario", "DR_MARIO"),
		Roy: ssbmChar(Character.ROY, "Roy", "ROY"),
		Pichu: ssbmChar(Character.PICHU, "Pichu", "PICHU"),
		Ganon: ssbmChar(Character.GANONDORF, "Ganondorf", "GANONDORF"),
		MasterHand: ssbmChar(Character.MASTER_HAND, "Master Hand", ""),
		WireframeMale: ssbmChar(Character.WIREFRAME_MALE, "Wireframe Male", ""),
		WireframeFemale: ssbmChar(Character.WIREFRAME_FEMALE, "Wireframe Female", ""),
		GigaBowser: ssbmChar(Character.GIGA_BOWSER, "Giga Bowser", ""),
		CrazyHand: ssbmChar(Character.CRAZY_HAND, "Crazy Hand", ""),
		Sandbag: ssbmChar(Character.SANDBAG, "Sandbag", ""),
		Popo: ssbmChar(Character.POPO, "Popo", ""),
		Invalid: ssbmChar(-1, "", "")
	}
};
const None = () => ({
	isSome: false,
	val: null
});
const Some = (val) => ({
	isSome: true,
	val
});
function Maybe(mv) {
	return mv === void 0 ? None() : Some(mv);
}
function iMaybe(m) {
	return m.isSome ? [m.val] : [];
}
//#endregion
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
function PathBuilder(...args) {
	function build(...subargs) {
		return path.join(...args, ...subargs);
	}
	return Object.assign(build, { partial: (...subargs) => PathBuilder(...args, ...subargs) });
}
function AppPathBuilders(appName, opts = {}) {
	const suffix = opts.suffix || "";
	const asDataSubdir = opts.asDataSubdir || /* @__PURE__ */ new Set();
	const paths = envPaths(appName, { suffix });
	function getBuilder(k) {
		return asDataSubdir.has(k) ? PathBuilder(paths.data, paths[k]) : PathBuilder(paths[k]);
	}
	return {
		config: getBuilder("config"),
		log: getBuilder("log"),
		data: getBuilder("data"),
		temp: getBuilder("temp"),
		cache: getBuilder("cache")
	};
}
const fs = {
	...nodeFs,
	imageToBase64DataUrl,
	exists,
	readString: (p) => fs.readFile(p, "utf-8").catch(() => {}),
	writeString: (p, c) => mkdirp(path.dirname(p)).then(() => fs.writeFile(p, c)).catch(() => {}),
	slurp: (p) => {
		return fs.readFile(p, "utf-8").then((s) => dec(s)).catch(() => void 0);
	},
	slurp1stCfg: async (p) => {
		for (const res of iMaybe(Maybe(await fs.slurp(`${p}.yaml`)))) return res;
		for (const res of iMaybe(Maybe(await fs.slurp(`${p}.json`)))) return res;
		for (const res of iMaybe(Maybe(await fs.slurp(p)))) return res;
	},
	spit: (p, obj) => {
		return Promise.resolve(obj).then((o) => fs.writeString(p, enc(o))).catch(() => {});
	},
	PathBuilder,
	AppPathBuilders
};
//#endregion
export { fs };
