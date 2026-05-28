import { t as __exportAll } from "./chunk.mjs";
import * as YAML from "js-yaml";
import { Character, SlippiGame } from "@slippi/slippi-js";
import { create } from "mutative";
//#region src/id.ts
var id_exports = /* @__PURE__ */ __exportAll({ of: () => of });
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
//#region src/RawSetClass.ts
var RawSetClass_default = Set;
//#endregion
//#region src/core.ts
const enc = YAML.dump;
const dec = YAML.load;
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
}
const None = () => ({
	isSome: false,
	val: null
});
const Some = (val) => ({
	isSome: true,
	val
});
function maybe(m, some, none) {
	return m.isSome ? some(m.val) : none();
}
function or(m, defaultVal) {
	return m.isSome ? m.val : defaultVal;
}
function Maybe(mv) {
	return mv === void 0 ? None() : Some(mv);
}
function iMaybe(m) {
	return m.isSome ? [m.val] : [];
}
function Ok(r) {
	return {
		isOk: true,
		res: r,
		err: null
	};
}
function Err(e) {
	return {
		isOk: false,
		res: null,
		err: e
	};
}
function Set$1(...els) {
	return new RawSetClass_default(els);
}
function chunk(a, chunkSize = 100) {
	const res = [];
	for (let i = 0; i < a.length; i += chunkSize) res.push([...a.slice(i, i + 100)]);
	return res;
}
//#endregion
//#region src/rwse.ts
function* pure(p) {
	return p;
}
function* ask() {
	return (yield { cmd: "ASK" }).reader;
}
function* get() {
	return (yield { cmd: "GET" }).state;
}
function* tell(val) {
	yield {
		cmd: "TELL",
		val
	};
}
function* put(val) {
	yield {
		cmd: "PUT",
		val
	};
}
function* fail(val) {
	yield {
		cmd: "FAIL",
		val
	};
}
function* waitFor(promise, catcher = () => void 0) {
	const { awaited } = yield {
		cmd: "AWAIT",
		val: promise,
		catcher
	};
	return awaited;
}
function* asks(f) {
	return f(yield* ask());
}
function* gets(f) {
	return f(yield* get());
}
function* mutate(f) {
	const curr = yield* get();
	const next = create(curr, (d) => {
		f(d);
	});
	if (curr == next) return false;
	yield* put(next);
	return true;
}
const STACK = new class StackConfigClass {
	initialState;
	joinWriters;
	reader;
	constructor(initialState, joinWriters, reader) {
		this.initialState = initialState;
		this.joinWriters = joinWriters;
		this.reader = reader;
	}
	_r(r) {
		return new StackConfigClass(this.initialState, this.joinWriters, r);
	}
	_w(joinWriters) {
		return new StackConfigClass(this.initialState, joinWriters, this.reader);
	}
	_s(initialState) {
		return new StackConfigClass(initialState, this.joinWriters, this.reader);
	}
	exec(m) {
		return exec(m, this);
	}
	execAsync(m) {
		return execAsync(m, this);
	}
}(void 0, void 0, void 0);
const r = (r) => STACK._r(r);
const rw = (r, w) => STACK._r(r)._w(w);
const rs = (r, s) => STACK._r(r)._s(s);
const rws = (r, w, s) => STACK._r(r)._w(w)._s(s);
const w = (w) => STACK._w(w);
const ws = (w, s) => STACK._w(w)._s(s);
const s = (s) => STACK._s(s);
function* reading(reader, m) {
	let awaited;
	const g = m;
	while (true) {
		const state = yield* get();
		const result = g.next({
			state,
			reader,
			awaited
		});
		if (result.done) return result.value;
		else awaited = yield result.value;
	}
}
function* writing(joinWrites, m) {
	let awaited;
	const g = m;
	const reader = yield* ask();
	const writes = [];
	while (true) {
		const state = yield* get();
		const result = g.next({
			state,
			reader,
			awaited
		});
		if (result.done) return [joinWrites(...writes), result.value];
		else if (result.value.cmd === "TELL") writes.push(result.value.val);
		else awaited = yield result.value;
	}
}
function* stating(initialState, m) {
	let awaited;
	const g = m;
	const reader = yield* ask();
	let state = initialState;
	while (true) {
		const result = g.next({
			state,
			reader,
			awaited
		});
		if (result.done) return [state, result.value];
		else if (result.value.cmd === "PUT") state = result.value.val;
		else awaited = yield result.value;
	}
}
function* catching(catcher, m) {
	let awaited;
	const g = m;
	const reader = yield* ask();
	while (true) {
		const state = yield* get();
		const result = g.next({
			state,
			reader,
			awaited
		});
		if (result.done) return result.value;
		else if (result.value.cmd === "FAIL") {
			const caught = catcher(result.value.val);
			if (caught.isOk) return caught.res;
			else yield {
				cmd: "FAIL",
				val: caught.err
			};
		} else awaited = yield result.value;
	}
}
function exec(m, stackCfg) {
	let res = void 0;
	execRaw(m, stackCfg, (finalRes) => res = finalRes);
	if (!res) throw "non-terminated rwse monad";
	return res;
}
async function execRaw(m, stackCfg, onDone) {
	const stack = stackCfg;
	function joinWrites(ws) {
		if (stack.joinWriters) return stack.joinWriters(...ws);
	}
	const writes = [];
	let state = stack.initialState;
	let awaited;
	const g = m;
	while (true) {
		const result = g.next({
			state,
			reader: stack.reader,
			awaited
		});
		if (result.done) return onDone({
			state,
			written: joinWrites(writes),
			isOk: true,
			res: result.value,
			err: null
		});
		else {
			const y = result.value;
			if (y.cmd === "TELL") writes.push(y.val);
			else if (y.cmd === "PUT") state = y.val;
			else if (y.cmd === "FAIL") return onDone({
				state,
				written: joinWrites(writes),
				isOk: false,
				err: y.val,
				res: null
			});
			else if (y.cmd === "AWAIT") try {
				awaited = await y.val;
			} catch (err) {
				if (!y.catcher) throw err;
				const caughtVal = y.catcher(err);
				if (!caughtVal) throw err;
				else if (!caughtVal.isOk) return onDone({
					state,
					written: joinWrites(writes),
					isOk: false,
					res: null,
					err: caughtVal.err
				});
				else awaited = caughtVal.res;
			}
		}
	}
}
function execAsync(m, stackCfg) {
	return new Promise((resolve) => execRaw(m, stackCfg, resolve));
}
function _Do(f) {
	const stkFns = {
		get,
		ask,
		gets,
		asks,
		mutate,
		put,
		fail,
		tell,
		catching,
		reading,
		writing,
		stating,
		waitFor
	};
	return (...args) => f(stkFns, ...args);
}
function _DoA(f) {
	const stkFns = {
		get,
		ask,
		gets,
		asks,
		mutate,
		put,
		fail,
		tell,
		catching,
		reading,
		writing,
		stating,
		waitFor
	};
	return (...args) => f(stkFns, ...args);
}
function DoR(...args) {
	return _Do(...args);
}
function DoR_(...args) {
	return _Do(...args);
}
function DoW(...args) {
	return _Do(...args);
}
function DoW_(...args) {
	return _Do(...args);
}
function DoS(...args) {
	return _Do(...args);
}
function DoS_(...args) {
	return _Do(...args);
}
function DoE(...args) {
	return _Do(...args);
}
function DoE_(...args) {
	return _Do(...args);
}
function DoRW(...args) {
	return _Do(...args);
}
function DoRW_(...args) {
	return _Do(...args);
}
function DoRS(...args) {
	return _Do(...args);
}
function DoRS_(...args) {
	return _Do(...args);
}
function DoRE(...args) {
	return _Do(...args);
}
function DoRE_(...args) {
	return _Do(...args);
}
function DoRWS(...args) {
	return _Do(...args);
}
function DoRWS_(...args) {
	return _Do(...args);
}
function DoRWE(...args) {
	return _Do(...args);
}
function DoRWE_(...args) {
	return _Do(...args);
}
function DoRSE(...args) {
	return _Do(...args);
}
function DoRSE_(...args) {
	return _Do(...args);
}
function DoRWSE(...args) {
	return _Do(...args);
}
function DoRWSE_(...args) {
	return _Do(...args);
}
function DoWS(...args) {
	return _Do(...args);
}
function DoWS_(...args) {
	return _Do(...args);
}
function DoWE(...args) {
	return _Do(...args);
}
function DoWE_(...args) {
	return _Do(...args);
}
function DoWSE(...args) {
	return _Do(...args);
}
function DoWSE_(...args) {
	return _Do(...args);
}
function DoSE(...args) {
	return _Do(...args);
}
function DoSE_(...args) {
	return _Do(...args);
}
function DoRA(...args) {
	return _DoA(...args);
}
function DoRA_(...args) {
	return _DoA(...args);
}
function DoWA(...args) {
	return _DoA(...args);
}
function DoWA_(...args) {
	return _DoA(...args);
}
function DoSA(...args) {
	return _DoA(...args);
}
function DoSA_(...args) {
	return _DoA(...args);
}
function DoEA(...args) {
	return _DoA(...args);
}
function DoEA_(...args) {
	return _DoA(...args);
}
function DoRWA(...args) {
	return _DoA(...args);
}
function DoRWA_(...args) {
	return _DoA(...args);
}
function DoRSA(...args) {
	return _DoA(...args);
}
function DoRSA_(...args) {
	return _DoA(...args);
}
function DoREA(...args) {
	return _DoA(...args);
}
function DoREA_(...args) {
	return _DoA(...args);
}
function DoRWSA(...args) {
	return _DoA(...args);
}
function DoRWSA_(...args) {
	return _DoA(...args);
}
function DoRWEA(...args) {
	return _DoA(...args);
}
function DoRWEA_(...args) {
	return _DoA(...args);
}
function DoRSEA(...args) {
	return _DoA(...args);
}
function DoRSEA_(...args) {
	return _DoA(...args);
}
function DoRWSEA(...args) {
	return _DoA(...args);
}
function DoRWSEA_(...args) {
	return _DoA(...args);
}
function DoWSA(...args) {
	return _DoA(...args);
}
function DoWSA_(...args) {
	return _DoA(...args);
}
function DoWEA(...args) {
	return _DoA(...args);
}
function DoWEA_(...args) {
	return _DoA(...args);
}
function DoWSEA(...args) {
	return _DoA(...args);
}
function DoWSEA_(...args) {
	return _DoA(...args);
}
function DoSEA(...args) {
	return _DoA(...args);
}
function DoSEA_(...args) {
	return _DoA(...args);
}
//#endregion
//#region src/incremental.ts
var incremental_exports = /* @__PURE__ */ __exportAll({ Ider: () => Ider });
function idKey(id) {
	const valueString = id ? `${id}` : "";
	return `${`${typeof id}`}|${valueString}`;
}
const optCase = (onSome, onNone) => (nilable) => {
	if (nilable !== void 0 && nilable !== null) return onSome(nilable);
	else return onNone();
};
var OptClass = class OptClass {
	#isNil;
	#nilable;
	constructor(nilable = void 0) {
		this.#nilable = nilable;
		this.#isNil = optCase(() => false, () => true)(nilable);
	}
	get isEmpty() {
		return this.#isNil;
	}
	case(onSome, onNone) {
		return optCase(onSome, onNone)(this.#nilable);
	}
	map(f) {
		return this.case((v) => new OptClass(f(v)), () => new OptClass());
	}
	bind(f) {
		return this.case((v) => f(v), () => new OptClass());
	}
	join(rhs) {
		return this.bind((l) => rhs.map((r) => [l, r]));
	}
};
function Opt(t) {
	return new OptClass(t);
}
var BaseDict_r = class {
	constructor() {}
	key(_k) {
		throw "unimplemented";
	}
	[Symbol.iterator]() {
		throw "unimplemented";
	}
	lookup(_k) {
		throw "unimplemented";
	}
	mutate(_mutater) {
		throw "unimplemented";
	}
	get src() {
		throw "unimplemented";
	}
	get changes() {
		throw "unimplemented";
	}
	get changed() {
		return this.changes.length > 0;
	}
};
var MutatedDict = class MutatedDict extends BaseDict_r {
	#base;
	#mutations;
	#iterated;
	constructor(base, mutater) {
		super();
		this.#base = base;
		this.#mutations = {};
		mutater({
			delete: (k) => this.delete(k),
			set: (k, v) => this.set(k, v)
		});
	}
	key(k) {
		return this.#base.key(k);
	}
	addMutation(k, m) {
		const id = this.key(k);
		const currMutation = this.#mutations[id];
		if (currMutation) {
			currMutation[3].push(currMutation[2]);
			currMutation[2] = m;
		} else this.#mutations[id] = [
			k,
			this.lookup(k),
			m,
			[]
		];
	}
	delete(k) {
		this.addMutation(k, ["del"]);
	}
	set(k, v) {
		this.addMutation(k, ["set", v]);
	}
	[Symbol.iterator]() {
		const cachedIterated = this.#iterated;
		if (cachedIterated) return (function* () {
			for (const next of cachedIterated) yield next;
		})();
		const base = this.#base;
		const mutations = this.#mutations;
		const setIterated = (iterated) => this.#iterated = iterated;
		return (function* () {
			const iterated = [];
			for (const next of base) {
				const [k] = next;
				if (!mutations[base.key(k)]) {
					iterated.push(next);
					yield next;
				}
			}
			for (const [k, _v, [mutationType, v]] of Object.values(mutations)) {
				if (mutationType === "del") continue;
				const next = [k, v];
				iterated.push(next);
				yield next;
			}
			setIterated(iterated);
		})();
	}
	lookup(k) {
		this.key(k);
		return Opt(void 0);
	}
	mutate(mutater) {
		return new MutatedDict(this, mutater);
	}
};
var PureDict_r = class extends BaseDict_r {
	#data = {};
	#idImplK;
	constructor(idImplK, entries) {
		super();
		this.#idImplK = idImplK;
		for (const [k, v] of entries) this.#data[this.key(k)] = [k, v];
	}
	key(k) {
		return idKey(this.#idImplK(k));
	}
	[Symbol.iterator]() {
		const self = this;
		return (function* () {
			for (const k in self.#data) {
				const val = self.#data[k];
				if (val) yield val;
			}
		})();
	}
	lookup(k) {
		const id = this.key(k);
		return Opt(this.#data[id]).map((entry) => entry[1]);
	}
	get src() {
		return this;
	}
	get changes() {
		return [];
	}
	mutate(mutater) {
		return new MutatedDict(this, mutater);
	}
};
var IderClass = class {
	#toId;
	constructor(toId) {
		this.#toId = toId;
	}
	Dict(...entries) {
		return new PureDict_r(this.#toId, entries);
	}
};
function Ider(f) {
	return new IderClass(f);
}
//#endregion
//#region src/interrupt.ts
var interrupt_exports = /* @__PURE__ */ __exportAll({ onInterrupt: () => onInterrupt });
let nextInterruptId = 1;
let intervalId = null;
var UtilClass = class {
	#manager;
	constructor(manager) {
		this.#manager = manager;
	}
	addYt(f) {
		return this.#manager.addYt(f);
	}
};
const handlers = {};
var InterruptManager = class {
	#lastYtAdd = null;
	constructor() {}
	get canAddYt() {
		const now = Date.now();
		return !this.#lastYtAdd || now - 1500 > this.#lastYtAdd;
	}
	addYt(f) {
		if (!this.canAddYt) return null;
		this.#lastYtAdd = Date.now();
		return f();
	}
	reset() {}
};
async function interruptHandler(manager) {
	manager.reset();
	const util = new UtilClass(manager);
	await Promise.all(Object.values(handlers).map((f) => f(util)));
}
function ensureIntervalOn() {
	if (intervalId !== null) return;
	const manager = new InterruptManager();
	intervalId = setInterval(() => interruptHandler(manager), 1e3);
}
function onInterrupt(f) {
	const interruptId = nextInterruptId++;
	handlers[interruptId] = f;
	ensureIntervalOn();
	return () => {
		delete handlers[interruptId];
	};
}
//#endregion
//#region src/proxy.ts
var proxy_exports = /* @__PURE__ */ __exportAll({ Of: () => Of });
function Of() {
	return { __typeRef: (t) => t };
}
//#endregion
export { $, $$, $$_, DoE, DoEA, DoEA_, DoE_, DoR, DoRA, DoRA_, DoRE, DoREA, DoREA_, DoRE_, DoRS, DoRSA, DoRSA_, DoRSE, DoRSEA, DoRSEA_, DoRSE_, DoRS_, DoRW, DoRWA, DoRWA_, DoRWE, DoRWEA, DoRWEA_, DoRWE_, DoRWS, DoRWSA, DoRWSA_, DoRWSE, DoRWSEA, DoRWSEA_, DoRWSE_, DoRWS_, DoRW_, DoR_, DoS, DoSA, DoSA_, DoSE, DoSEA, DoSEA_, DoSE_, DoS_, DoW, DoWA, DoWA_, DoWE, DoWEA, DoWEA_, DoWE_, DoWS, DoWSA, DoWSA_, DoWSE, DoWSEA, DoWSEA_, DoWSE_, DoWS_, DoW_, Err, id_exports as Id, incremental_exports as Inc, interrupt_exports as Int, Maybe, None, Ok, proxy_exports as Proxy, SSBM, Set$1 as Set, Some, _map, _or, _without, ask, asks, catching, chunk, dec, enc, exec, execAndExit, execAsync, fail, firsty, get, gets, iMaybe, isNil, isNotNil, maybe, mutate, or, pure, put, r, reading, rs, rw, rws, s, stating, tell, timeout, w, waitFor, withInd, writing, ws };
