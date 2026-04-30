import { Character } from "@slippi/slippi-js";

//#region src/index.ts
function $(k) {
	return (t) => t[k];
}
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
function buildSsbmChar(id, name, slippiApiName) {
	return {
		id,
		name,
		slippiApiName
	};
}
const ssbmChar = (...args) => {
	const char = buildSsbmChar(...args);
	setCharById(char.id, char);
	setCharBySlippiApiName(char.slippiApiName, char);
	return char;
};
const SSBM = { Char: {
	of: (id) => getCharById(id),
	ofSlippiApiName: (name) => getCharBySlippiApiName(name),
	Falcon: ssbmChar(Character.CAPTAIN_FALCON, "Captain Falcon", "CAPTAIN_FALCON"),
	DK: ssbmChar(Character.DONKEY_KONG, "Donkey Kong", "DONKEY_KONG"),
	Fox: ssbmChar(Character.FOX, "Fox", "FOX"),
	GameAndWatch: ssbmChar(Character.GAME_AND_WATCH, "Mr. Game & Watch", "GAME_AND_WATCH"),
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
	ICs: ssbmChar(Character.ICE_CLIMBERS, "Ice Climbers", "ICE_CLIMBERS"),
	Puff: ssbmChar(Character.JIGGLYPUFF, "Jigglypuff", "JIGGLYPUFF"),
	Samus: ssbmChar(Character.SAMUS, "Samus", "SAMUS"),
	Yoshi: ssbmChar(Character.YOSHI, "Yoshi", "YOSHI"),
	Zelda: ssbmChar(Character.ZELDA, "Zelda", "ZELDA"),
	Sheik: ssbmChar(Character.SHEIK, "Sheik", "SHEIK"),
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
} };
function _map(v, f) {
	return isNotNil(v) ? f(v) : v;
}
function _or(v, fb) {
	return isNotNil(v) ? v : fb;
}
function _without(a) {
	return a.flatMap((v) => isNotNil(v) ? [v] : []);
}
function isNotNil(v) {
	return v !== void 0 && v !== null;
}
function isNil(v) {
	return v !== void 0 && v !== null;
}
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function execAndExit(p) {
	p.then(() => process.exit()).catch((e) => {
		console.error(e);
		process.exit(1);
	});
}
function withInd(a) {
	return a.map((t, ind) => [t, ind]);
}
function firsty(...args) {
	for (const arg of args) if (isNotNil(arg)) return arg;
	return void 0;
}

//#endregion
export { $, $$, $$_, SSBM, _map, _or, _without, execAndExit, firsty, isNil, isNotNil, timeout, withInd };