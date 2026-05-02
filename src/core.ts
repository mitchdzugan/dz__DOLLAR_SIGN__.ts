import { Character } from "@slippi/slippi-js";
import * as Id from "./id.js";

export type Nil = null | undefined;
export type NonNil = Exclude<any, Nil>;
export type Nilable<T extends NonNil> = T | null | undefined;

export function $<K extends keyof T, T extends { [P in keyof K]: any }>(
  k: K,
): (t: T) => T[K] {
  return (t: T) => t[k];
}

export function $$(k: string): any {
  return (obj: NonNil) => obj[k];
}

export function $$_(k: string): any {
  return (obj: NonNil, v: any) => (obj[k] = v);
}

export type SSBMChar = {
  id: number;
  name: string;
  slippiApiName: string;
  preferCSP: boolean;
  meleeCSPDirname: string;
  meleeCSPFilename: string;
};

const charRecordGetter = (recName: string) => () => {
  const charRecord = $$(recName)(ssbmChar) || {};
  $$_(recName)(ssbmChar, charRecord);
  return charRecord;
};

const charRecordRowGetter = (recName: string) => (k: any) =>
  charRecordGetter(recName)()[k] || SSBM.Char.Invalid;

const charRecordRowSetter = (recName: string) => (k: any, v: any) =>
  (charRecordGetter(recName)()[k] = v);

const setCharById = charRecordRowSetter("__charById");
const setCharBySlippiApiName = charRecordRowSetter("__charBySlippiApiName");

const getCharById = charRecordRowGetter("__charById");
const getCharBySlippiApiName = charRecordRowGetter("__charBySlippiApiName");

type SSBMCharOpts = Partial<{
  preferCSP: boolean;
  meleeCSPDirname: string;
  meleeCSPFilename: string;
}>;
function buildSsbmChar(
  id: number,
  name: string,
  slippiApiName: string,
  opts: SSBMCharOpts = {},
): SSBMChar {
  return {
    preferCSP: false,
    meleeCSPFilename: name,
    meleeCSPDirname: opts.meleeCSPFilename || name,
    id,
    name,
    slippiApiName,
    ...opts,
  };
}

const ssbmChar: typeof buildSsbmChar = (...args) => {
  const char = buildSsbmChar(...args);
  setCharById(char.id, char);
  setCharBySlippiApiName(char.slippiApiName, char);
  return char;
};

export const SSBM = {
  Char: {
    of: (id: number) => getCharById(id),
    ofSlippiApiName: (name: string) => getCharBySlippiApiName(name),
    Falcon: ssbmChar(
      Character.CAPTAIN_FALCON,
      "Captain Falcon",
      "CAPTAIN_FALCON",
    ),
    DK: ssbmChar(Character.DONKEY_KONG, "Donkey Kong", "DONKEY_KONG"),
    Fox: ssbmChar(Character.FOX, "Fox", "FOX"),
    GameAndWatch: ssbmChar(
      Character.GAME_AND_WATCH,
      "Mr. Game & Watch",
      "GAME_AND_WATCH",
      { meleeCSPFilename: "Mr. Game and Watch" },
    ),
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
    Zelda: ssbmChar(Character.ZELDA, "Zelda", "ZELDA", {
      meleeCSPDirname: "Zelda and Sheik",
    }),
    Sheik: ssbmChar(Character.SHEIK, "Sheik", "SHEIK", {
      meleeCSPDirname: "Zelda and Sheik",
    }),
    Falco: ssbmChar(Character.FALCO, "Falco", "FALCO"),
    YLink: ssbmChar(Character.YOUNG_LINK, "Young Link", "YOUNG_LINK"),
    Doc: ssbmChar(Character.DR_MARIO, "Dr. Mario", "DR_MARIO"),
    Roy: ssbmChar(Character.ROY, "Roy", "ROY"),
    Pichu: ssbmChar(Character.PICHU, "Pichu", "PICHU"),
    Ganon: ssbmChar(Character.GANONDORF, "Ganondorf", "GANONDORF"),
    MasterHand: ssbmChar(Character.MASTER_HAND, "Master Hand", ""),
    WireframeMale: ssbmChar(Character.WIREFRAME_MALE, "Wireframe Male", ""),
    WireframeFemale: ssbmChar(
      Character.WIREFRAME_FEMALE,
      "Wireframe Female",
      "",
    ),
    GigaBowser: ssbmChar(Character.GIGA_BOWSER, "Giga Bowser", ""),
    CrazyHand: ssbmChar(Character.CRAZY_HAND, "Crazy Hand", ""),
    Sandbag: ssbmChar(Character.SANDBAG, "Sandbag", ""),
    Popo: ssbmChar(Character.POPO, "Popo", ""),
    Invalid: ssbmChar(-1, "", ""),
  },
};

export function _map<T1 extends NonNil, T2 extends NonNil>(
  v: Nilable<T1>,
  f: (t: T1) => T2,
): Nilable<T2> {
  return isNotNil(v) ? f(v) : v;
}

export function _or<T extends NonNil>(v: Nilable<T>, fb: T): T {
  return isNotNil(v) ? v : fb;
}

export function _without<T extends NonNil>(a: Nilable<T>[]): T[] {
  return a.flatMap((v) => (isNotNil(v) ? [v] : []));
}

export function isNotNil<T extends NonNil>(v: Nilable<T>): v is T {
  return v !== undefined && v !== null;
}

export function isNil<T extends NonNil>(v: Nilable<T>): v is T {
  return v !== undefined && v !== null;
}

export const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function execAndExit(p: Promise<any>) {
  p.then(() => process.exit()).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export function withInd<T>(a: T[]): [T, number][] {
  return a.map((t, ind) => [t, ind]);
}

export function firsty<T>(...args: Nilable<T>[]): T | undefined {
  for (const arg of args) {
    if (isNotNil(arg)) {
      return arg;
    }
  }
  return undefined;
}
