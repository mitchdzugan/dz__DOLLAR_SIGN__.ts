import * as nodeFs from "node:fs/promises";
import * as path from "node:path";
import { mkdirp } from "mkdirp";
import envPaths from "env-paths";
import * as YAML from "js-yaml";
import { Character, SlippiGame } from "@slippi/slippi-js";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/id.ts
function b6Char(n) {
	return [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		"-"
	][n] || "_";
}
function b8sToB6s(...b8s) {
	const res = [];
	const incoming = [...b8s];
	incoming.reverse();
	for (let i = 0; i < incoming.length; i++) {
		const b0 = Math.pow(256, 0) * (incoming[i + 0] || 0);
		const b1 = Math.pow(256, 1) * (incoming[i + 1] || 0);
		const b2 = Math.pow(256, 2) * (incoming[i + 2] || 0);
		let v = b0 + b1 + b2;
		for (let j = 0; j < 4; j++) {
			res.push(v % 64);
			v = Math.floor(v / 64);
		}
	}
	res.reverse();
	let start = 0;
	while (start < 4 && !res[start]) start++;
	return res.slice(start);
}
function strIdStr(s) {
	return b8sToB6s(...new TextEncoder().encode(s)).map((n) => b6Char(n)).join("");
}
const OF_LITERALS = /* @__PURE__ */ new Map();
OF_LITERALS.set(void 0, "U");
OF_LITERALS.set(null, "0");
OF_LITERALS.set(true, "t");
OF_LITERALS.set(false, "f");
function of(v) {
	const litVal = OF_LITERALS.get(v);
	if (litVal) return litVal;
	else if (typeof v === "number") return `N${strIdStr(`${v}`)}`;
	else return `S${strIdStr(v)}`;
}
//#endregion
//#region src/slp.ts
var slp_exports = /* @__PURE__ */ __exportAll({ parseIntakeGame: () => parseIntakeGame });
function _S(t) {
	return [t];
}
const Props = (props) => {
	function CLEAN(v) {
		const typeofStr = typeof v;
		if (Array.isArray(v)) return v.map(CLEAN).filter((v) => v !== void 0);
		if (v === null || v === false) return;
		if (typeofStr === "object") return Props(v);
		return v;
	}
	const ks = Object.keys(props);
	for (const k of ks) {
		props[k] = CLEAN(props[k]);
		if (props[k] === void 0) delete props[k];
	}
	return props;
};
const nil = (v) => v === null ? void 0 : v;
const snil = (v) => v === "" ? void 0 : nil(v);
function isAny(v) {
	return v !== void 0 && v !== null;
}
function slpId(ident) {
	if (ident.type === "SeedStart") return [
		"RT",
		of(ident.seed),
		of(ident.startAt)
	].join(".");
	else if (ident.type === "SeedSession") return [
		"RS",
		of(ident.seed),
		of(ident.session),
		of(ident.game),
		of(ident.tiebreaker)
	].join(".");
	return "";
}
const PLAYER_IND_LOOKUP = {
	[0]: 0,
	[1]: 1,
	[2]: 2,
	[3]: 3
};
function playerMap(r) {
	const res = {};
	for (const [_k, _v] of Object.entries(r || {})) {
		const k = PLAYER_IND_LOOKUP[_k];
		const v = _v;
		if (k === void 0) continue;
		res[k] = v;
	}
	return res;
}
const ALL_PLAYER_INDS = [
	0,
	1,
	2,
	3
];
var SlpGame = class {
	game;
	settings;
	gameEnd;
	metadata;
	metadataPlayers;
	settingsPlayers;
	playerIndSet;
	_frames;
	_lastFrame;
	constructor(g) {
		this.game = g;
		this.settings = g.getSettings();
		this.gameEnd = g.getGameEnd();
		this.metadata = g.getMetadata();
		this.metadataPlayers = playerMap(this.metadata?.players);
		this.settingsPlayers = playerMap(this.settings?.players);
		this.playerIndSet = new Set(ALL_PLAYER_INDS.filter((ind) => Boolean(this.metadataPlayers[ind]) || Boolean(this.settingsPlayers[ind])));
	}
	get numPlayers() {
		return this.playerIndSet.size;
	}
	get gameEndMethod() {
		return this.gameEnd?.gameEndMethod;
	}
	get frames() {
		const framesRef = this._frames || [this.game.getFrames()];
		this._frames = framesRef;
		return framesRef[0];
	}
	getLastFrameImpl() {
		return this.metadata?.lastFrame || (() => Math.max(...Object.keys(this.frames).map((s) => parseInt(s, 10))))();
	}
	get lastFrame() {
		const lastFrameRef = this._lastFrame || [this.getLastFrameImpl()];
		this._lastFrame = lastFrameRef;
		return lastFrameRef[0];
	}
	get startAt() {
		const startAtStr = this.metadata?.startAt || void 0;
		return !startAtStr ? void 0 : new Date(startAtStr).valueOf();
	}
	get ident() {
		const startAt = this.startAt;
		const randomSeed = this.settings?.randomSeed;
		if (isAny(startAt) && isAny(randomSeed)) return {
			type: "SeedStart",
			startAt,
			seed: randomSeed
		};
		if (isAny(randomSeed) && this.settings?.matchInfo?.sessionId) {
			const { sessionId, tiebreakerNumber, gameNumber } = this.settings?.matchInfo;
			return {
				type: "SeedSession",
				seed: randomSeed,
				session: sessionId,
				game: gameNumber,
				tiebreaker: tiebreakerNumber
			};
		}
		console.error(this.settings);
		console.error(this.metadata);
		throw "unmade uniqueId";
	}
	get id() {
		return slpId(this.ident);
	}
};
function parseIntakeGame(b) {
	const slpGame = new SlippiGame(b);
	const slpGame_ = new SlpGame(slpGame);
	const stats = slpGame.getStats();
	const settings = slpGame.getSettings();
	const gameEnd = slpGame.getGameEnd();
	const metadata = slpGame.getMetadata();
	const metadataPlayers = metadata?.players || {};
	const _sPlayers = settings?.players || [];
	const settingsPlayers = {};
	for (const player of _sPlayers) settingsPlayers[player.playerIndex] = player;
	const getPlayerType = (ind) => {
		const readType = settingsPlayers[ind]?.type;
		if (readType === 0) return "PLAYER";
		if (readType === 1) return "CPU";
		return "UNKNOWN";
	};
	const getCC = (ind) => nil(settingsPlayers[ind]?.connectCode || metadataPlayers[ind]?.names?.code);
	const getDisplayName = (ind) => nil(settingsPlayers[ind]?.displayName || metadataPlayers[ind]?.names?.netplay);
	const getInGameTag = (ind) => snil(settingsPlayers[ind]?.nametag);
	const allPlayerInds = new Set([...Object.keys(metadataPlayers).map((s) => parseInt(s)), ...Object.keys(settingsPlayers).map((s) => parseInt(s))]);
	const lastFrame = metadata?.lastFrame || (() => Math.max(...Object.keys(slpGame.getFrames()).map((s) => parseInt(s, 10))))();
	const startAtStr = metadata?.startAt || void 0;
	const randomSeed = settings?.randomSeed;
	const stageId = settings?.stageId;
	const startAt = startAtStr && new Date(startAtStr).valueOf();
	const placementsByIndex = {};
	const overallStatsList = stats?.overall || [];
	const overallByIndex = {};
	for (const overallStats of overallStatsList) overallByIndex[overallStats.playerIndex] = overallStats;
	const actionStatsList = stats?.actionCounts || [];
	const actionByIndex = {};
	for (const actionStats of actionStatsList) actionByIndex[actionStats.playerIndex] = actionStats;
	for (const { playerIndex, position } of gameEnd?.placements || []) {
		if (playerIndex === void 0 || position === void 0) continue;
		placementsByIndex[playerIndex] = position;
	}
	const winners = slpGame.getWinners() || [];
	const winnerInds = new Set(winners.map((w) => w.playerIndex));
	const matchInfo = settings?.matchInfo;
	const sessionId = snil(matchInfo?.sessionId || matchInfo?.matchId);
	const inGameMode = settings?.inGameMode;
	const isTeams = settings?.isTeams;
	const numPlayers = allPlayerInds.size;
	const allParsedPlayers = [...allPlayerInds].every((ind) => Boolean(settingsPlayers[ind]));
	const conversions = stats?.conversions || [];
	const anyParsedConversions = conversions.length > 0;
	const is1v1ParsedSingles = inGameMode === 32 && !isTeams && numPlayers === 2 && allParsedPlayers && anyParsedConversions;
	const session = sessionId ? sessionId : "";
	return {
		game: {
			game_id: slpGame_.id,
			session,
			props: Props({
				slpVersion: snil(settings?.slpVersion),
				gameMode: settings?.gameMode,
				inGameMode,
				isTeams,
				numPlayers,
				allParsedPlayers,
				anyParsedConversions,
				is1v1ParsedSingles,
				stageId,
				lastFrame,
				randomSeed,
				startAt,
				console_name: snil(metadata?.consoleNick),
				platform: snil(metadata?.playedOn),
				gameEndMethod: gameEnd?.gameEndMethod,
				lrasInitiatorIndex: gameEnd?.lrasInitiatorIndex,
				sessionId,
				sessionGameNumber: settings?.matchInfo?.gameNumber,
				sessionTiebreakerNumber: settings?.matchInfo?.tiebreakerNumber,
				isRanked: (sessionId || "").startsWith("mode.ranked")
			})
		},
		ports: [...allPlayerInds].flatMap((ind) => {
			const port = settingsPlayers[ind]?.port;
			if (port === void 0) return [];
			return _S({
				port,
				props: Props({
					playerType: getPlayerType(ind),
					entrant: ind,
					cc: getCC(ind),
					displayName: getDisplayName(ind),
					inGameTag: getInGameTag(ind),
					charId: settingsPlayers[ind]?.characterId,
					colorId: settingsPlayers[ind]?.characterColor,
					isLrasInitiator: ind === gameEnd?.lrasInitiatorIndex,
					placement: placementsByIndex[ind],
					isWinner: winnerInds.has(ind),
					isLoser: winnerInds.size > 0 && !winnerInds.has(ind),
					groundTechAway: actionByIndex[ind]?.groundTechCount?.away,
					groundTechIn: actionByIndex[ind]?.groundTechCount?.in,
					groundTechNeutral: actionByIndex[ind]?.groundTechCount?.neutral,
					groundTechFail: actionByIndex[ind]?.groundTechCount?.fail,
					wallTech: actionByIndex[ind]?.wallTechCount?.success,
					wallTechFail: actionByIndex[ind]?.wallTechCount?.fail,
					jab1: actionByIndex[ind]?.attackCount?.jab1,
					jab2: actionByIndex[ind]?.attackCount?.jab2,
					jab3: actionByIndex[ind]?.attackCount?.jab3,
					jabm: actionByIndex[ind]?.attackCount?.jabm,
					dash: actionByIndex[ind]?.attackCount?.dash,
					ftilt: actionByIndex[ind]?.attackCount?.ftilt,
					dtilt: actionByIndex[ind]?.attackCount?.dtilt,
					utilt: actionByIndex[ind]?.attackCount?.utilt,
					fsmash: actionByIndex[ind]?.attackCount?.fsmash,
					dsmash: actionByIndex[ind]?.attackCount?.dsmash,
					usmash: actionByIndex[ind]?.attackCount?.usmash,
					nair: actionByIndex[ind]?.attackCount?.nair,
					fair: actionByIndex[ind]?.attackCount?.fair,
					bair: actionByIndex[ind]?.attackCount?.bair,
					uair: actionByIndex[ind]?.attackCount?.uair,
					dair: actionByIndex[ind]?.attackCount?.dair,
					roll: actionByIndex[ind]?.rollCount,
					ledgeGrab: actionByIndex[ind]?.ledgegrabCount,
					spotDodge: actionByIndex[ind]?.spotDodgeCount,
					dashDance: actionByIndex[ind]?.dashDanceCount,
					airDodge: actionByIndex[ind]?.airDodgeCount,
					wavedash: actionByIndex[ind]?.wavedashCount,
					waveland: actionByIndex[ind]?.wavelandCount,
					lCancel: actionByIndex[ind]?.lCancelCount?.success,
					lCancelFail: actionByIndex[ind]?.lCancelCount?.fail,
					edgeCancel: actionByIndex[ind]?.edgeCancelCount?.success,
					edgeCancelSlow: actionByIndex[ind]?.edgeCancelCount?.slow,
					grab: actionByIndex[ind]?.grabCount?.success,
					grabFail: actionByIndex[ind]?.grabCount?.fail,
					throwUp: actionByIndex[ind]?.throwCount?.up,
					throwBack: actionByIndex[ind]?.throwCount?.back,
					throwDown: actionByIndex[ind]?.throwCount?.down,
					throwForward: actionByIndex[ind]?.throwCount?.forward,
					inputsButtons: overallByIndex[ind]?.inputCounts?.buttons,
					inputsTriggers: overallByIndex[ind]?.inputCounts?.triggers,
					inputsCstick: overallByIndex[ind]?.inputCounts?.cstick,
					inputsJoystick: overallByIndex[ind]?.inputCounts?.joystick,
					inputsTotal: overallByIndex[ind]?.inputCounts?.total,
					totalDamage: overallByIndex[ind]?.totalDamage,
					killCount: overallByIndex[ind]?.killCount,
					ipm: overallByIndex[ind]?.inputsPerMinute?.ratio,
					dipm: overallByIndex[ind]?.digitalInputsPerMinute?.ratio,
					opk: overallByIndex[ind]?.openingsPerKill?.ratio,
					neutralRate: overallByIndex[ind]?.neutralWinRatio?.ratio,
					counterRate: overallByIndex[ind]?.counterHitRatio?.ratio,
					tradeRate: overallByIndex[ind]?.beneficialTradeRatio?.ratio
				})
			});
		}),
		marks: !is1v1ParsedSingles ? [] : conversions.flatMap((combo) => {
			const { playerIndex, startFrame, startPercent, endPercent } = combo;
			const { endFrame, didKill, openingType, moves } = combo;
			const port = settingsPlayers[playerIndex]?.port;
			if (port === void 0) return [];
			const frameDelta = endFrame === void 0 ? NaN : endFrame - startFrame;
			const validFrameDelta = !Number.isNaN(frameDelta) && frameDelta >= 0;
			const percentDelta = endPercent === void 0 ? NaN : endPercent - startPercent;
			const validPercentDelta = !Number.isNaN(percentDelta) && percentDelta >= 0;
			return _S({
				process: "intake",
				start: startFrame,
				length: validFrameDelta ? frameDelta : lastFrame - startFrame,
				props: {
					type: "slp|stats|conversion",
					openingPort: port,
					openingType,
					lastHitBy: combo.lastHitBy,
					didKill: startFrame > (endFrame || 0) ? true : didKill,
					startPercent,
					totalDamage: validPercentDelta ? percentDelta : moves.reduce((dmg, m) => dmg + m.damage, 0),
					numMoves: moves.length,
					moves: moves.map((m) => m.moveId)
				}
			});
		})
	};
}
//#endregion
//#region src/core.ts
function enc(t, opts = {}) {
	if (opts.yaml) return YAML.dump(t);
	return JSON.stringify(t);
}
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
	Slp: slp_exports,
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
