import { t as __exportAll } from "./chunk.mjs";
import { Character } from "@slippi/slippi-js";
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
//#region src/core.ts
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
const SSBM = { Char: {
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
	ICs: ssbmChar(Character.ICE_CLIMBERS, "Ice Climbers", "ICE_CLIMBERS"),
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
}
//#endregion
//#region src/rwse.ts
function* ask() {
	const { reader } = yield { cmd: "ASK" };
	return reader;
}
function* tell(w) {
	yield {
		cmd: "TELL",
		val: w
	};
}
function* get() {
	const { state } = yield { cmd: "GET" };
	return state;
}
function* put(s) {
	yield {
		cmd: "PUT",
		val: s
	};
}
function* fail(e) {
	yield {
		cmd: "FAIL",
		val: e
	};
}
function* waitFor(promise, catcher = () => void 0) {
	const { awaited } = yield {
		cmd: "WAIT_FOR",
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
function exec(stack, m) {
	const reader = stack.reader;
	const writes = [];
	let state = stack.initialState;
	const g = m();
	while (true) {
		const result = g.next({
			state,
			reader,
			awaited: null
		});
		if (result.done) return {
			state,
			written: stack.joinWriters(...writes),
			isOk: true,
			res: result.value,
			err: void 0
		};
		else {
			const y = result.value;
			if (y.cmd === "TELL") writes.push(y.val);
			else if (y.cmd === "PUT") state = y.val;
			else if (y.cmd === "FAIL") return {
				state,
				written: stack.joinWriters(...writes),
				isOk: false,
				err: y.val,
				res: void 0
			};
		}
	}
}
async function execAsync(stack, m) {
	const writes = [];
	let state = stack.initialState;
	let awaited;
	const g = m();
	while (true) {
		const result = g.next({
			state,
			reader: stack.reader,
			awaited
		});
		if (result.done) return {
			state,
			written: stack.joinWriters(...writes),
			isOk: true,
			err: void 0,
			res: result.value
		};
		else {
			const y = result.value;
			if (y.cmd === "TELL") writes.push(y.val);
			else if (y.cmd === "PUT") state = y.val;
			else if (y.cmd === "FAIL") return {
				state,
				written: stack.joinWriters(...writes),
				isOk: false,
				res: void 0,
				err: y.val
			};
			else if (y.cmd === "WAIT_FOR") try {
				awaited = await y.val;
			} catch (err) {
				const [catchType, catchVal] = y.catcher(err, {
					ok: (r) => ["r", r],
					err: (e) => ["f", e]
				}) || [];
				if (!catchType) throw err;
				else if (catchType === "f") return {
					state,
					written: stack.joinWriters(...writes),
					isOk: false,
					res: void 0,
					err: catchVal
				};
				else awaited = catchVal;
			}
		}
	}
}
function Stack(reader, initialState, joinWriters) {
	const stack = {
		reader,
		initialState,
		joinWriters,
		exec: (m) => exec(stack, m),
		execAsync: (m) => execAsync(stack, m)
	};
	return stack;
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
const NumIder = Ider((i) => i);
console.log("intDict!!!");
console.log(...NumIder.Dict([1, 5], [2, 3]).mutate(($) => {
	$.set(1, 2);
	$.delete(2);
}));
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
		return !this.#lastYtAdd || now - 4500 > this.#lastYtAdd;
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
export { $, $$, $$_, id_exports as Id, incremental_exports as Inc, interrupt_exports as Int, SSBM, Stack, _map, _or, _without, ask, asks, exec, execAndExit, execAsync, fail, firsty, get, gets, isNil, isNotNil, mutate, put, tell, timeout, waitFor, withInd };
