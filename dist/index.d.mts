import { t as __exportAll } from "./chunk.mjs";
import { Draft } from "mutative";

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
//#endregion
//#region src/rwse.d.ts
type YieldNext<R, S> = {
  reader: R$1;
  state: S;
  awaited: any;
};
type YieldVal<W, S, E> = {
  cmd: "ASK";
} | {
  cmd: "TELL";
  val: W;
} | {
  cmd: "GET";
} | {
  cmd: "PUT";
  val: S;
} | {
  cmd: "FAIL";
  val: E;
};
type CatcherResType<Err, Res> = undefined | ["f", Err] | ["r", Res];
type CatcherType<Err, Res> = (e: any, fns: {
  ok: (r: Res) => CatcherResType<Err, Res>;
  err: (e: Err) => CatcherResType<Err, Res>;
}) => CatcherResType<Err, Res>;
type YieldValAsync<W, S, E> = YieldVal<W, S, E> | {
  cmd: "WAIT_FOR";
  val: Promise<any>;
  catcher: CatcherType<E, any>;
};
type RWSE<R, W, S, E, Res> = Generator<YieldVal<W, S, E>, Res, YieldNext<R$1, S>>;
type RWSEA<R, W, S, E, Res> = Generator<YieldValAsync<W, S, E>, Res, YieldNext<R$1, S>>;
type R$1<Rt, Res> = RWSE<Rt, any, any, any, Res>;
type W<Wt, Res> = RWSE<any, Wt, any, any, Res>;
type S<St, Res> = RWSE<any, any, St, any, Res>;
type E<Et, Res> = RWSE<any, any, any, Et, Res>;
type RA<Rt, Res> = RWSEA<Rt, any, any, any, Res>;
type WA<Wt, Res> = RWSEA<any, Wt, any, any, Res>;
type SA<St, Res> = RWSEA<any, any, St, any, Res>;
type EA<Et, Res> = RWSEA<any, any, any, Et, Res>;
type RW<Rt, Wt, Res> = RWSE<Rt, Wt, any, any, Res>;
type RS<Rt, St, Res> = RWSE<Rt, any, St, any, Res>;
type RE<Rt, Et, Res> = RWSE<Rt, any, any, Et, Res>;
type RWA<Rt, Wt, Res> = RWSEA<Rt, Wt, any, any, Res>;
type RSA<Rt, St, Res> = RWSEA<Rt, any, St, any, Res>;
type REA<Rt, Et, Res> = RWSEA<Rt, any, any, Et, Res>;
type Either<R, E> = {
  isOk: true;
  res: R$1;
  err: undefined;
} | {
  isOk: false;
  err: E;
  res: undefined;
};
type ExecRes<W, S, E, Res> = Either<Res, E> & {
  state: S;
  written: W;
};
declare function ask<R>(): RWSE<R$1, any, any, any, R$1>;
declare function tell<W>(w: W): RWSE<any, W, any, any, void>;
declare function get<S>(): RWSE<any, any, S, any, S>;
declare function put<S>(s: S): RWSE<any, any, S, any, void>;
declare function fail<E>(e: E): RWSE<any, any, any, E, void>;
declare function waitFor<E, P>(promise: Promise<P>, catcher?: CatcherType<E, P>): RWSEA<any, any, any, E, P>;
declare function asks<R, Res>(f: (r: R$1) => Res): RWSE<R$1, any, any, any, Res>;
declare function gets<S, Res>(f: (s: S) => Res): RWSE<any, any, S, any, Res>;
declare function mutate<S>(f: (d: Draft<S>) => void): RWSE<any, any, S, any, boolean>;
type Stack<R, W, S> = {
  reader: R$1;
  initialState: S;
  joinWriters(...ws: W[]): W;
  exec<E, Res>(m: () => RWSE<R$1, W, S, E, Res>): ExecRes<W, S, E, Res>;
  execAsync<E, Res>(m: () => RWSEA<R$1, W, S, E, Res>): Promise<ExecRes<W, S, E, Res>>;
};
declare function exec<R, W, S, E, Res>(stack: Stack<R$1, W, S>, m: () => RWSE<R$1, W, S, E, Res>): ExecRes<W, S, E, Res>;
declare function execAsync<R, W, S, E, Res>(stack: Stack<R$1, W, S>, m: () => RWSEA<R$1, W, S, E, Res>): Promise<ExecRes<W, S, E, Res>>;
declare function Stack<R, W, S>(reader: R$1, initialState: S, joinWriters: (...ws: W[]) => W): Stack<R$1, W, S>;
type M$<S extends Stack<any, any, any>, E, Res> = RWSE<S["reader"], S["initialState"], ReturnType<S["joinWriters"]>, E, Res>;
type IdLiteral = null | undefined | string | number | boolean;
declare function of(v: IdLiteral): string;
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
declare class UtilClass {
  #private;
  constructor(manager: InterruptManager);
  addYt<T>(f: () => T): T | null;
}
declare class InterruptManager {
  #private;
  constructor();
  get canAddYt(): boolean;
  addYt<T>(f: () => T): T | null;
  reset(): void;
}
declare function onInterrupt(f: (util: UtilClass) => Promise<void>): () => void;
type InterruptUtil = UtilClass;
//#endregion
export { $, $$, $$_, E, EA, id_d_exports as Id, incremental_d_exports as Inc, interrupt_d_exports as Int, M$, Nil, Nilable, NonNil, R$1 as R, RA, RE, REA, RS, RSA, RW, RWA, RWSE, RWSEA, S, SA, SSBM, SSBMChar, Stack, W, WA, _map, _or, _without, ask, asks, exec, execAndExit, execAsync, fail, firsty, get, gets, isNil, isNotNil, mutate, put, tell, timeout, waitFor, withInd };