import { __export } from "./chunk-B9dir_RE.mjs";

//#region src/core.d.ts
type Nil = null | undefined;
type NonNil = Exclude<any, Nil>;
type Nilable<T extends NonNil> = T | null | undefined;
declare function $<K extends keyof T, T extends { [P in keyof K]: any }>(k: K): (t: T) => T[K];
declare function $$(k: string): any;
declare function $$_(k: string): any;
type SSBMChar = {
  id: number;
  name: string;
  slippiApiName: string;
  preferCSP: boolean;
  meleeCSPDirname: string;
  meleeCSPFilename: string;
};
declare const SSBM: {
  Char: {
    of: (id: number) => any;
    ofSlippiApiName: (name: string) => any;
    Falcon: SSBMChar;
    DK: SSBMChar;
    Fox: SSBMChar;
    GameAndWatch: SSBMChar;
    Kirby: SSBMChar;
    Bowser: SSBMChar;
    Link: SSBMChar;
    Luigi: SSBMChar;
    Mario: SSBMChar;
    Marth: SSBMChar;
    Mewtwo: SSBMChar;
    Ness: SSBMChar;
    Peach: SSBMChar;
    Pikachu: SSBMChar;
    ICs: SSBMChar;
    Puff: SSBMChar;
    Samus: SSBMChar;
    Yoshi: SSBMChar;
    Zelda: SSBMChar;
    Sheik: SSBMChar;
    Falco: SSBMChar;
    YLink: SSBMChar;
    Doc: SSBMChar;
    Roy: SSBMChar;
    Pichu: SSBMChar;
    Ganon: SSBMChar;
    MasterHand: SSBMChar;
    WireframeMale: SSBMChar;
    WireframeFemale: SSBMChar;
    GigaBowser: SSBMChar;
    CrazyHand: SSBMChar;
    Sandbag: SSBMChar;
    Popo: SSBMChar;
    Invalid: SSBMChar;
  };
};
declare function _map<T1 extends NonNil, T2 extends NonNil>(v: Nilable<T1>, f: (t: T1) => T2): Nilable<T2>;
declare function _or<T extends NonNil>(v: Nilable<T>, fb: T): T;
declare function _without<T extends NonNil>(a: Nilable<T>[]): T[];
declare function isNotNil<T extends NonNil>(v: Nilable<T>): v is T;
declare function isNil<T extends NonNil>(v: Nilable<T>): v is T;
declare const timeout: (ms: number) => Promise<unknown>;
declare function execAndExit(p: Promise<any>): void;
declare function withInd<T>(a: T[]): [T, number][];
declare function firsty<T>(...args: Nilable<T>[]): T | undefined;
declare namespace id_d_exports {
  export { IdLiteral, of };
}
type IdLiteral = null | undefined | string | number | boolean;
declare function of(v: IdLiteral): string;
declare namespace incremental_d_exports {
  export { Ider };
}
type Nilable$1<T extends {}> = T | null | undefined;
declare class OptClass<T extends {}> {
  #private;
  constructor(nilable?: T | undefined | null);
  get isEmpty(): boolean;
  case<R>(onSome: (t: T) => R, onNone: () => R): R;
  map<R extends {}>(f: (t: T) => R): OptClass<R>;
  bind<R extends {}>(f: (t: T) => OptClass<R>): OptClass<R>;
  join<R extends {}>(rhs: OptClass<R>): OptClass<[T, R]>;
}
type Opt<T extends {}> = OptClass<T>;
declare function Opt<T extends {}>(t: Nilable$1<T>): Opt<T>;
interface DictMut_r<K, T extends {}> {
  delete(k: K): void;
  set(k: K, v: T): void;
}
type DictKeyMutation<V extends {}> = ["set", V] | ["del"];
interface Dict_r<K, T extends {}> {
  [Symbol.iterator](): Iterator<[K, T]>;
  lookup(k: K): Opt<T>;
  key(k: K): string;
  src: BaseDict_r<K, T>;
  changed: boolean;
  changes: DictKeyMutation<T>[];
  mutate(mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T>;
}
declare class BaseDict_r<K, T extends {}> implements Dict_r<K, T> {
  constructor();
  key(_k: K): string;
  [Symbol.iterator](): Iterator<[K, T]>;
  lookup(_k: K): Opt<T>;
  mutate(_mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T>;
  get src(): BaseDict_r<K, T>;
  get changes(): DictKeyMutation<T>[];
  get changed(): boolean;
}
declare class PureDict_r<K, T extends {}> extends BaseDict_r<K, T> {
  #private;
  constructor(idImplK: (k: K) => IdLiteral, entries: Iterable<[K, T]>);
  key(k: K): string;
  [Symbol.iterator](): Iterator<[K, T]>;
  lookup(k: K): Opt<T>;
  get src(): this;
  get changes(): never[];
  mutate(mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T>;
}
declare class IderClass<T> {
  #private;
  constructor(toId: (t: T) => IdLiteral);
  Dict<V extends {}>(...entries: [T, V][]): PureDict_r<T, V>;
}
type Ider<T extends {}> = IderClass<T>;
declare function Ider<T extends {}>(f: (t: T) => IdLiteral): Ider<T>;
//#endregion
export { $, $$, $$_, id_d_exports as Id, incremental_d_exports as Inc, Nil, Nilable, NonNil, SSBM, SSBMChar, _map, _or, _without, execAndExit, firsty, isNil, isNotNil, timeout, withInd };