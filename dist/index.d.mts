import { t as __exportAll } from "./chunk.mjs";
import * as YAML from "js-yaml";
import { Draft } from "mutative";

//#region src/slp.d.ts
type IntakeGameMark = {
  process: string;
  start: number;
  length: number;
  props: Props;
};
type IntakeGame = {
  game: {
    game_id: string;
    session: string;
    props: Props;
  };
  ports: {
    port: number;
    props: Props;
  }[];
  marks: IntakeGameMark[];
};
type PlayerTypeLabel = "PLAYER" | "CPU" | "UNKNOWN";
declare const Props: (props: Props) => Props;
declare function parseIntakeGame(b: NodeJS.ArrayBufferView): IntakeGame;
//#endregion
//#region src/core.d.ts
type EncodeOpts = {
  yaml?: boolean;
};
declare function enc<T extends object>(t: T, opts?: EncodeOpts): string;
declare const dec: typeof YAML.load;
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
  Slp: typeof slp_d_exports;
  GAME_FIRST_FRAME: number;
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
type Maybe<T> = {
  isSome: true;
  val: T;
} | {
  isSome: false;
  val: null;
};
declare const None: <T>() => Maybe<T>;
declare const Some: <T>(val: T) => Maybe<T>;
declare function maybe<T, R>(m: Maybe<T>, some: (t: T) => R, none: () => R): R;
declare function or<T>(m: Maybe<T>, defaultVal: T): T;
declare function Maybe<T>(mv: undefined | T): Maybe<T>;
declare function iMaybe<T>(m: Maybe<T>): Iterable<T>;
type Either<R, E> = {
  isOk: true;
  res: R;
  err: null;
} | {
  isOk: false;
  err: E;
  res: null;
};
declare function Ok<R, E>(r: R): Either<R, E>;
declare function Err$1<R, E>(e: E): Either<R, E>;
declare function Set<T>(...els: T[]): Set<T>;
type Props = Record<string, any>;
declare function chunk<T>(a: T[], chunkSize?: number): T[][];
declare function simpleHash(str: string): number;
declare function assertNonNil<T>(v: Nilable<T>, msg?: string): asserts v is T;
declare function envVar(varname: string, defaultValue?: string): string;
declare function psuedoRng(seed: number): () => number;
//#endregion
//#region src/rwse.d.ts
type YieldVal<R, W, S, E, A extends boolean> = {
  cmd: "NOOP";
} | ([R$1] extends [never] ? {
  cmd: "NOOP";
} : {
  cmd: "ASK";
  ID: (r: R$1) => R$1;
}) | ([S$1] extends [never] ? {
  cmd: "NOOP";
} : {
  cmd: "GET";
}) | ([S$1] extends [never] ? {
  cmd: "NOOP";
} : {
  cmd: "PUT";
  val: S$1;
}) | ([E$1] extends [never] ? {
  cmd: "NOOP";
} : {
  cmd: "FAIL";
  val: E$1;
}) | ([W] extends [never] ? {
  cmd: "NOOP";
} : {
  cmd: "TELL";
  val: W;
}) | ([A] extends [false] ? {
  cmd: "NOOP";
} : {
  cmd: "AWAIT";
  val: Promise<any>;
  catcher?: CatcherType<E$1, any>;
});
type YieldNext<R, S> = ([R$1] extends [never] ? {
  reader: any;
} : {
  reader: R$1;
}) & ([S$1] extends [never] ? {
  state: any;
} : {
  state: S$1;
}) & {
  awaited: any;
};
type RWSE$G_<M, R, W, S, E, A extends boolean> = Generator<YieldVal<R$1, W, S$1, E$1, A>, M, YieldNext<R$1, S$1>>;
type RWSE$G<M, R, W, S, E> = RWSE$G_<M, R$1, W, S$1, E$1, false>;
type RWSE$GA<M, R, W, S, E> = RWSE$G_<M, R$1, W, S$1, E$1, true>;
type R$1<Rt, Res = void> = RWSE$G<Res, Rt, never, never, never>;
type W<Wt, Res = void> = RWSE$G<Res, never, Wt, never, never>;
type S$1<St, Res = void> = RWSE$G<Res, never, never, St, never>;
type E$1<Et, Res = void> = RWSE$G<Res, never, never, never, Et>;
type RW<Rt, Wt, Res = void> = RWSE$G<Res, Rt, Wt, never, never>;
type RS<Rt, St, Res = void> = RWSE$G<Res, Rt, never, St, never>;
type RE<Rt, Et, Res = void> = RWSE$G<Res, Rt, never, never, Et>;
type WS<Wt, St, Res = void> = RWSE$G<Res, never, Wt, St, never>;
type WE<Wt, Et, Res = void> = RWSE$G<Res, never, Wt, never, Et>;
type SE<St, Et, Res = void> = RWSE$G<Res, never, never, St, Et>;
type WSE<Wt, St, Et, Res = void> = RWSE$G<Res, never, Wt, St, Et>;
type RSE<Rt, St, Et, Res = void> = RWSE$G<Res, Rt, never, St, Et>;
type RWE<Rt, Wt, Et, Res = void> = RWSE$G<Res, Rt, Wt, never, Et>;
type RWS<Rt, Wt, St, Res = void> = RWSE$G<Res, Rt, Wt, St, never>;
type RA<Rt, Res = void> = RWSE$GA<Res, Rt, never, never, never>;
type WA<Wt, Res = void> = RWSE$GA<Res, never, Wt, never, never>;
type SA<St, Res = void> = RWSE$GA<Res, never, never, St, never>;
type EA<Et, Res = void> = RWSE$GA<Res, never, never, never, Et>;
type RWA<Rt, Wt, Res = void> = RWSE$GA<Res, Rt, Wt, never, never>;
type RSA<Rt, St, Res = void> = RWSE$GA<Res, Rt, never, St, never>;
type REA<Rt, Et, Res = void> = RWSE$GA<Res, Rt, never, never, Et>;
type WSA<Wt, St, Res = void> = RWSE$GA<Res, never, Wt, St, never>;
type WEA<Wt, Et, Res = void> = RWSE$GA<Res, never, Wt, never, Et>;
type SEA<St, Et, Res = void> = RWSE$GA<Res, never, never, St, Et>;
type WSEA<Wt, St, Et, Res = void> = RWSE$GA<Res, never, Wt, St, Et>;
type RSEA<Rt, St, Et, Res = void> = RWSE$GA<Res, Rt, never, St, Et>;
type RWEA<Rt, Wt, Et, Res = void> = RWSE$GA<Res, Rt, Wt, never, Et>;
type RWSA<Rt, Wt, St, Res = void> = RWSE$GA<Res, Rt, Wt, St, never>;
type RWSEA<Rt, Wt, St, Et, Res = void> = RWSE$GA<Res, Rt, Wt, St, Et>;
declare function pure<Pt>(p: Pt): R$1<never, Pt>;
declare function ask<Rt>(): R$1<Rt, Rt>;
declare function get<St>(): S$1<St, St>;
declare function tell<Wt>(val: Wt): W<Wt>;
declare function put<St>(val: St): S$1<St>;
declare function fail<Et, Rt>(val: Et): E$1<Et, Rt>;
declare function waitFor<Et, Pt>(promise: Promise<Pt>, catcher?: CatcherType<Et, Pt>): EA<Et, Pt>;
declare function asks<Rt, Rr>(f: (s: Rt) => Rr): R$1<Rt, Rr>;
declare function gets<St, Rr>(f: (s: St) => Rr): S$1<St, Rr>;
declare function mutate<St>(f: (s: Draft<St>) => void): S$1<St, boolean>;
type StackFns_<R, W, S, E, A extends boolean> = {
  stating<S2, Res>(initialState: S2, m: RWSE$G_<Res, R$1, W, S2, E$1, A>): RWSE$G_<[S2, Res], R$1, W, S$1, E$1, A>;
  writing<W2, Res>(joinWrites: (...ws: W2[]) => W2, m: RWSE$G_<Res, R$1, W2, S$1, E$1, A>): RWSE$G_<[W2, Res], R$1, W, S$1, E$1, A>;
  reading<R2, Res>(reader: R2, m: RWSE$G_<Res, R2, W, S$1, E$1, A>): RWSE$G_<Res, R$1, W, S$1, E$1, A>;
  catching<E2, Res>(catcher: (e: E2) => Either<Res, E$1>, m: RWSE$G_<Res, R$1, W, S$1, E2, A>): RWSE$G_<Res, R$1, W, S$1, E$1, A>;
} & ([S$1] extends [never] ? {} : {
  get: typeof get<S$1>;
  put: typeof put<S$1>;
  mutate: typeof mutate<S$1>;
  gets: <T>(f: (s: S$1) => T) => RWSE$G<T, never, never, S$1, never>;
}) & ([R$1] extends [never] ? {} : {
  asks: <T>(f: (r: R$1) => T) => RWSE$G<T, R$1, never, never, never>;
  ask: typeof ask<R$1>;
}) & ([W] extends [never] ? {} : {
  tell: typeof tell<W>;
}) & ([E$1] extends [never] ? {} : {
  fail: <Rt>(e: E$1) => RWSE$G<Rt, never, never, never, E$1>;
}) & ([A] extends [false] ? {} : {
  waitFor: <Pt>(promise: Promise<Pt>, catcher?: CatcherType<E$1, Pt>) => RWSE$GA<Pt, never, never, never, E$1>;
});
type StackFns<R, W, S, E> = StackFns_<R$1, W, S$1, E$1, false>;
type StackFnsA<R, W, S, E> = StackFns_<R$1, W, S$1, E$1, true>;
type ExecRes<W, S, E, Res> = Either<Res, E$1> & {
  state: S$1;
  written: W;
};
type CatcherType<Err, Res> = (e: any) => undefined | Either<Res, Err>;
declare class StackConfigClass<R, W, S> {
  initialState: S$1;
  joinWriters: (...ws: W[]) => W;
  reader: R$1;
  constructor(initialState: S$1, joinWriters: (...ws: W[]) => W, reader: R$1);
  _r<R2>(r: R2): StackConfigClass<R2, W, S$1>;
  _w<W2>(joinWriters: (...ws: W2[]) => W2): StackConfigClass<R$1, W2, S$1>;
  _s<S2>(initialState: S2): StackConfigClass<R$1, W, S2>;
  exec<E, Res>(m: RWSE$G<Res, R$1, W, S$1, E$1>): ExecRes<W, S$1, E$1, Res>;
  execAsync<E, Res>(m: RWSE$GA<Res, R$1, W, S$1, E$1>): Promise<ExecRes<W, S$1, E$1, Res>>;
}
declare const r: <R>(r: R$1) => StackConfigClass<R$1, never, never>;
declare const rw: <R, W>(r: R$1, w: (...ws: W[]) => W) => StackConfigClass<R$1, W, never>;
declare const rs: <R, S>(r: R$1, s: S$1) => StackConfigClass<R$1, never, S$1>;
declare const rws: <R, W, S>(r: R$1, w: (...ws: W[]) => W, s: S$1) => StackConfigClass<R$1, W, S$1>;
declare const w: <W>(w: (...ws: W[]) => W) => StackConfigClass<never, W, never>;
declare const ws: <W, S>(w: (...ws: W[]) => W, s: S$1) => StackConfigClass<never, W, S$1>;
declare const s: <S>(s: S$1) => StackConfigClass<never, never, S$1>;
declare function reading<R2, R, W, S, E, A extends boolean, Res>(reader: R2, m: RWSE$G_<Res, R2, W, S$1, E$1, A>): RWSE$G_<Res, R$1, W, S$1, E$1, A>;
declare function writing<W2, R, W, S, E, A extends boolean, Res>(joinWrites: (...ws: W2[]) => W2, m: RWSE$G_<Res, R$1, W2, S$1, E$1, A>): RWSE$G_<[W2, Res], R$1, W, S$1, E$1, A>;
declare function stating<S2, R, W, S, E, A extends boolean, Res>(initialState: S2, m: RWSE$G_<Res, R$1, W, S2, E$1, A>): RWSE$G_<[S2, Res], R$1, W, S$1, E$1, A>;
declare function catching<E2, R, W, S, E, A extends boolean, Res>(catcher: (e: E2) => Either<Res, E$1>, m: RWSE$G_<Res, R$1, W, S$1, E2, A>): RWSE$G_<Res, R$1, W, S$1, E$1, A>;
declare function exec<R, W, S, E, Res>(m: RWSE$G<Res, R$1, W, S$1, E$1>, stackCfg: StackConfigClass<R$1, W, S$1>): ExecRes<W, S$1, E$1, Res>;
declare function execAsync<R, W, S, E, Res>(m: RWSE$GA<Res, R$1, W, S$1, E$1>, stackCfg: StackConfigClass<R$1, W, S$1>): Promise<ExecRes<W, S$1, E$1, Res>>;
declare function _Do<R, W, S, E, Res = void, Args extends any[] = []>(f: (stkFns: StackFns<R$1, W, S$1, E$1>, ...args: Args) => RWSE$G<Res, R$1, W, S$1, E$1>): (...args: Args) => RWSE$G<Res, R$1, W, S$1, E$1>;
type _Do<R, W, S, E, Res, Args extends any[]> = typeof _Do<R$1, W, S$1, E$1, Res, Args>;
declare function _DoA<R, W, S, E, Res = void, Args extends any[] = []>(f: (stkFns: StackFnsA<R$1, W, S$1, E$1>, ...args: Args) => RWSE$GA<Res, R$1, W, S$1, E$1>): (...args: Args) => RWSE$GA<Res, R$1, W, S$1, E$1>;
type _DoA<R, W, S, E, Res, Args extends any[]> = typeof _DoA<R$1, W, S$1, E$1, Res, Args>;
declare function DoR<R, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, never, never, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, never, never, never>;
declare function DoR_<R, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, never, never, void, Args>>): (...args: Args) => RWSE$G<void, R$1, never, never, never>;
declare function DoW<W, Res = void, Args extends any[] = []>(...args: Parameters<_Do<never, W, never, never, Res, Args>>): (...args: Args) => RWSE$G<Res, never, W, never, never>;
declare function DoW_<W, Args extends any[] = []>(...args: Parameters<_Do<never, W, never, never, void, Args>>): (...args: Args) => RWSE$G<void, never, W, never, never>;
declare function DoS<S, Res = void, Args extends any[] = []>(...args: Parameters<_Do<never, never, S$1, never, Res, Args>>): (...args: Args) => RWSE$G<Res, never, never, S$1, never>;
declare function DoS_<S, Args extends any[] = []>(...args: Parameters<_Do<never, never, S$1, never, void, Args>>): (...args: Args) => RWSE$G<void, never, never, S$1, never>;
declare function DoE<E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<never, never, never, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, never, never, never, E$1>;
declare function DoE_<E, Args extends any[] = []>(...args: Parameters<_Do<never, never, never, E$1, void, Args>>): (...args: Args) => RWSE$G<void, never, never, never, E$1>;
declare function DoRW<R, W, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, never, never, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, W, never, never>;
declare function DoRW_<R, W, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, never, never, void, Args>>): (...args: Args) => RWSE$G<void, R$1, W, never, never>;
declare function DoRS<R, S, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, S$1, never, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, never, S$1, never>;
declare function DoRS_<R, S, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, S$1, never, void, Args>>): (...args: Args) => RWSE$G<void, R$1, never, S$1, never>;
declare function DoRE<R, E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, never, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, never, never, E$1>;
declare function DoRE_<R, E, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, never, E$1, void, Args>>): (...args: Args) => RWSE$G<void, R$1, never, never, E$1>;
declare function DoRWS<R, W, S, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, S$1, never, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, W, S$1, never>;
declare function DoRWS_<R, W, S, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, S$1, never, void, Args>>): (...args: Args) => RWSE$G<void, R$1, W, S$1, never>;
declare function DoRWE<R, W, E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, never, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, W, never, E$1>;
declare function DoRWE_<R, W, E, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, never, E$1, void, Args>>): (...args: Args) => RWSE$G<void, R$1, W, never, E$1>;
declare function DoRSE<R, S, E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, never, S$1, E$1>;
declare function DoRSE_<R, S, E, Args extends any[] = []>(...args: Parameters<_Do<R$1, never, S$1, E$1, void, Args>>): (...args: Args) => RWSE$G<void, R$1, never, S$1, E$1>;
declare function DoRWSE<R, W, S, E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, R$1, W, S$1, E$1>;
declare function DoRWSE_<R, W, S, E, Args extends any[] = []>(...args: Parameters<_Do<R$1, W, S$1, E$1, void, Args>>): (...args: Args) => RWSE$G<void, R$1, W, S$1, E$1>;
declare function DoWS<W, S, Res = void, Args extends any[] = []>(...args: Parameters<_Do<never, W, S$1, never, Res, Args>>): (...args: Args) => RWSE$G<Res, never, W, S$1, never>;
declare function DoWS_<W, S, Args extends any[] = []>(...args: Parameters<_Do<never, W, S$1, never, void, Args>>): (...args: Args) => RWSE$G<void, never, W, S$1, never>;
declare function DoWE<W, E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<never, W, never, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, never, W, never, E$1>;
declare function DoWE_<W, E, Args extends any[] = []>(...args: Parameters<_Do<never, W, never, E$1, void, Args>>): (...args: Args) => RWSE$G<void, never, W, never, E$1>;
declare function DoWSE<W, S, E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<never, W, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, never, W, S$1, E$1>;
declare function DoWSE_<W, S, E, Args extends any[] = []>(...args: Parameters<_Do<never, W, S$1, E$1, void, Args>>): (...args: Args) => RWSE$G<void, never, W, S$1, E$1>;
declare function DoSE<S, E, Res = void, Args extends any[] = []>(...args: Parameters<_Do<never, never, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$G<Res, never, never, S$1, E$1>;
declare function DoSE_<S, E, Args extends any[] = []>(...args: Parameters<_Do<never, never, S$1, E$1, void, Args>>): (...args: Args) => RWSE$G<void, never, never, S$1, E$1>;
declare function DoRA<R, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, never, never, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, never, never, never>;
declare function DoRA_<R, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, never, never, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, never, never, never>;
declare function DoWA<W, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<never, W, never, never, Res, Args>>): (...args: Args) => RWSE$GA<Res, never, W, never, never>;
declare function DoWA_<W, Args extends any[] = []>(...args: Parameters<_DoA<never, W, never, never, void, Args>>): (...args: Args) => RWSE$GA<void, never, W, never, never>;
declare function DoSA<S, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<never, never, S$1, never, Res, Args>>): (...args: Args) => RWSE$GA<Res, never, never, S$1, never>;
declare function DoSA_<S, Args extends any[] = []>(...args: Parameters<_DoA<never, never, S$1, never, void, Args>>): (...args: Args) => RWSE$GA<void, never, never, S$1, never>;
declare function DoEA<E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<never, never, never, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, never, never, never, E$1>;
declare function DoEA_<E, Args extends any[] = []>(...args: Parameters<_DoA<never, never, never, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, never, never, never, E$1>;
declare function DoRWA<R, W, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, never, never, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, W, never, never>;
declare function DoRWA_<R, W, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, never, never, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, W, never, never>;
declare function DoRSA<R, S, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, S$1, never, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, never, S$1, never>;
declare function DoRSA_<R, S, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, S$1, never, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, never, S$1, never>;
declare function DoREA<R, E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, never, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, never, never, E$1>;
declare function DoREA_<R, E, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, never, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, never, never, E$1>;
declare function DoRWSA<R, W, S, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, S$1, never, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, W, S$1, never>;
declare function DoRWSA_<R, W, S, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, S$1, never, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, W, S$1, never>;
declare function DoRWEA<R, W, E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, never, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, W, never, E$1>;
declare function DoRWEA_<R, W, E, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, never, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, W, never, E$1>;
declare function DoRSEA<R, S, E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, never, S$1, E$1>;
declare function DoRSEA_<R, S, E, Args extends any[] = []>(...args: Parameters<_DoA<R$1, never, S$1, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, never, S$1, E$1>;
declare function DoRWSEA<R, W, S, E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, R$1, W, S$1, E$1>;
declare function DoRWSEA_<R, W, S, E, Args extends any[] = []>(...args: Parameters<_DoA<R$1, W, S$1, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, R$1, W, S$1, E$1>;
declare function DoWSA<W, S, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<never, W, S$1, never, Res, Args>>): (...args: Args) => RWSE$GA<Res, never, W, S$1, never>;
declare function DoWSA_<W, S, Args extends any[] = []>(...args: Parameters<_DoA<never, W, S$1, never, void, Args>>): (...args: Args) => RWSE$GA<void, never, W, S$1, never>;
declare function DoWEA<W, E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<never, W, never, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, never, W, never, E$1>;
declare function DoWEA_<W, E, Args extends any[] = []>(...args: Parameters<_DoA<never, W, never, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, never, W, never, E$1>;
declare function DoWSEA<W, S, E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<never, W, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, never, W, S$1, E$1>;
declare function DoWSEA_<W, S, E, Args extends any[] = []>(...args: Parameters<_DoA<never, W, S$1, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, never, W, S$1, E$1>;
declare function DoSEA<S, E, Res = void, Args extends any[] = []>(...args: Parameters<_DoA<never, never, S$1, E$1, Res, Args>>): (...args: Args) => RWSE$GA<Res, never, never, S$1, E$1>;
declare function DoSEA_<S, E, Args extends any[] = []>(...args: Parameters<_DoA<never, never, S$1, E$1, void, Args>>): (...args: Args) => RWSE$GA<void, never, never, S$1, E$1>;
type IdLiteral = null | undefined | string | number | boolean;
declare function of(v: IdLiteral): string;
type Proxy<T> = {
  __typeRef: (t: T) => T;
};
type Of<T> = Proxy<T>;
type Unwrap<T extends Proxy<any>> = ReturnType<T["__typeRef"]>;
declare function Of<T>(): Proxy<T>;
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
type DictKeyMutations<K, V extends {}> = [K, Opt<V>, DictKeyMutation<V>, DictKeyMutation<V>[]];
interface Dict_r<K, T extends {}> {
  [Symbol.iterator](): Iterator<[K, T]>;
  lookup(k: K): Opt<T>;
  key(k: K): string;
  src: BaseDict_r<K, T>;
  isChanged: boolean;
  changes: DictKeyMutations<K, T>[];
  mutate(mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T>;
}
declare class BaseDict_r<K, T extends {}> implements Dict_r<K, T> {
  constructor();
  key(_k: K): string;
  [Symbol.iterator](): Iterator<[K, T]>;
  lookup(_k: K): Opt<T>;
  mutate(_mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T>;
  get src(): BaseDict_r<K, T>;
  get changes(): DictKeyMutations<K, T>[];
  get isChanged(): boolean;
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
  id(t: T): IdLiteral;
}
type Ider<T extends {}> = IderClass<T>;
declare const Ider: {
  Lit: IderClass<IdLiteral>;
  Num: IderClass<number>;
  Str: IderClass<string>;
  for: <T extends {}>(f: (t: T) => IdLiteral) => Ider<T>;
};
declare class ZDataClass<T extends Record<string, ZData>> {
  zdata: T;
  constructor(data: T);
}
type ZData = null | string | number | boolean | ZData[] | ZDataClass<any>;
type ZBin = Map<IdLiteral, any>;
type ZObjMeta<T extends ZObjType<T>> = [T, ZBin, ZObjProxyType<T>];
type ZObjType<T> = { [K in keyof T]: ZData };
type ZObjProxyType<T extends ZObjType<any>> = { [K in keyof T]: Of<T[K]> };
type ZObj<T extends ZObjType<T>> = (() => ZObjMeta<T>) & T;
type ZAdtRep<V extends "zvar" | "zobj", T extends ZObjType<T>> = [V, ZObjProxyType<T>];
type ZAdt_i<T extends ZAdtRep<any, any>, O, V> = T[0] extends "zobj" ? O : V;
declare function ZAdtRep<S extends "zobj" | "zvar">(o: S): <T extends ZObjType<T>>(p: ZObjProxyType<T>) => ZAdtRep<S, T>;
declare const defZObj: <T extends ZObjType<T>>(p: ZObjProxyType<T>) => ZAdtRep<"zobj", T>;
declare const defZVar: <T extends ZObjType<T>>(p: ZObjProxyType<T>) => ZAdtRep<"zvar", T>;
declare function mk<S extends "zobj" | "zvar", T extends ZObjType<T>>(rep: ZAdtRep<S, T>): ZAdt_i<ZAdtRep<S, T>, (t: T) => ZObj<T>, { [K in keyof T]: (d: T[K]) => () => ZObjMeta<{
  data: T[K];
}> }>;
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
//#region src/index.d.ts
type Arg1<F extends (...args: any[]) => any> = Parameters<F>[0];
//#endregion
export { $, $$, $$_, Arg1, DoE, DoEA, DoEA_, DoE_, DoR, DoRA, DoRA_, DoRE, DoREA, DoREA_, DoRE_, DoRS, DoRSA, DoRSA_, DoRSE, DoRSEA, DoRSEA_, DoRSE_, DoRS_, DoRW, DoRWA, DoRWA_, DoRWE, DoRWEA, DoRWEA_, DoRWE_, DoRWS, DoRWSA, DoRWSA_, DoRWSE, DoRWSEA, DoRWSEA_, DoRWSE_, DoRWS_, DoRW_, DoR_, DoS, DoSA, DoSA_, DoSE, DoSEA, DoSEA_, DoSE_, DoS_, DoW, DoWA, DoWA_, DoWE, DoWEA, DoWEA_, DoWE_, DoWS, DoWSA, DoWSA_, DoWSE, DoWSEA, DoWSEA_, DoWSE_, DoWS_, DoW_, E$1 as E, EA, Either, Err$1 as Err, ExecRes, id_d_exports as Id, incremental_d_exports as Inc, interrupt_d_exports as Int, Maybe, Nil, Nilable, NonNil, None, Ok, Props, proxy_d_exports as Proxy, R$1 as R, RA, RE, REA, RS, RSA, RSE, RSEA, RW, RWA, RWE, RWEA, RWS, RWSA, RWSEA, S$1 as S, SA, SE, SEA, SSBM, SSBMChar, Set, Some, W, WA, WE, WEA, WS, WSA, WSE, WSEA, _map, _or, _without, ask, asks, assertNonNil, catching, chunk, dec, enc, envVar, exec, execAndExit, execAsync, fail, firsty, get, gets, iMaybe, isNil, isNotNil, maybe, mutate, or, psuedoRng, pure, put, r, reading, rs, rw, rws, s, simpleHash, stating, tell, timeout, w, waitFor, withInd, writing, ws };