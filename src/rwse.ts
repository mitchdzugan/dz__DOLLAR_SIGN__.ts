import { create, type Draft } from "mutative";
import * as $ from "./core.js";

type YieldVal<R, W, S, E, A extends boolean> =
  | { cmd: "NOOP" }
  | ([R] extends [never] ? { cmd: "NOOP" } : { cmd: "ASK"; ID: (r: R) => R })
  | ([S] extends [never] ? { cmd: "NOOP" } : { cmd: "GET" })
  | ([S] extends [never] ? { cmd: "NOOP" } : { cmd: "PUT"; val: S })
  | ([E] extends [never] ? { cmd: "NOOP" } : { cmd: "FAIL"; val: E })
  | ([W] extends [never] ? { cmd: "NOOP" } : { cmd: "TELL"; val: W })
  | ([A] extends [false]
      ? { cmd: "NOOP" }
      : { cmd: "AWAIT"; val: Promise<any>; catcher?: CatcherType<E, any> });

type YieldNext<R, S> = ([R] extends [never] ? { reader: any } : { reader: R }) &
  ([S] extends [never] ? { state: any } : { state: S }) & { awaited: any };

type RWSE$G_<M, R, W, S, E, A extends boolean> = Generator<
  YieldVal<R, W, S, E, A>,
  M,
  YieldNext<R, S>
>;
type RWSE$G<M, R, W, S, E> = RWSE$G_<M, R, W, S, E, false>;
type RWSE$GA<M, R, W, S, E> = RWSE$G_<M, R, W, S, E, true>;

export type R<Rt, Res = void> = RWSE$G<Res, Rt, never, never, never>;
export type W<Wt, Res = void> = RWSE$G<Res, never, Wt, never, never>;
export type S<St, Res = void> = RWSE$G<Res, never, never, St, never>;
export type E<Et, Res = void> = RWSE$G<Res, never, never, never, Et>;

export type RW<Rt, Wt, Res = void> = RWSE$G<Res, Rt, Wt, never, never>;
export type RS<Rt, St, Res = void> = RWSE$G<Res, Rt, never, St, never>;
export type RE<Rt, Et, Res = void> = RWSE$G<Res, Rt, never, never, Et>;
export type WS<Wt, St, Res = void> = RWSE$G<Res, never, Wt, St, never>;
export type WE<Wt, Et, Res = void> = RWSE$G<Res, never, Wt, never, Et>;
export type SE<St, Et, Res = void> = RWSE$G<Res, never, never, St, Et>;

export type WSE<Wt, St, Et, Res = void> = RWSE$G<Res, never, Wt, St, Et>;
export type RSE<Rt, St, Et, Res = void> = RWSE$G<Res, Rt, never, St, Et>;
export type RWE<Rt, Wt, Et, Res = void> = RWSE$G<Res, Rt, Wt, never, Et>;
export type RWS<Rt, Wt, St, Res = void> = RWSE$G<Res, Rt, Wt, St, never>;

export type RA<Rt, Res = void> = RWSE$GA<Res, Rt, never, never, never>;
export type WA<Wt, Res = void> = RWSE$GA<Res, never, Wt, never, never>;
export type SA<St, Res = void> = RWSE$GA<Res, never, never, St, never>;
export type EA<Et, Res = void> = RWSE$GA<Res, never, never, never, Et>;

export type RWA<Rt, Wt, Res = void> = RWSE$GA<Res, Rt, Wt, never, never>;
export type RSA<Rt, St, Res = void> = RWSE$GA<Res, Rt, never, St, never>;
export type REA<Rt, Et, Res = void> = RWSE$GA<Res, Rt, never, never, Et>;
export type WSA<Wt, St, Res = void> = RWSE$GA<Res, never, Wt, St, never>;
export type WEA<Wt, Et, Res = void> = RWSE$GA<Res, never, Wt, never, Et>;
export type SEA<St, Et, Res = void> = RWSE$GA<Res, never, never, St, Et>;

export type WSEA<Wt, St, Et, Res = void> = RWSE$GA<Res, never, Wt, St, Et>;
export type RSEA<Rt, St, Et, Res = void> = RWSE$GA<Res, Rt, never, St, Et>;
export type RWEA<Rt, Wt, Et, Res = void> = RWSE$GA<Res, Rt, Wt, never, Et>;
export type RWSA<Rt, Wt, St, Res = void> = RWSE$GA<Res, Rt, Wt, St, never>;

export type RWSEA<Rt, Wt, St, Et, Res = void> = RWSE$GA<Res, Rt, Wt, St, Et>;

export function* ask<Rt>(): R<Rt, Rt> {
  const _val = yield { cmd: "ASK" } as YieldVal<Rt, never, never, never, false>;
  const val = _val as unknown as YieldNext<Rt, never>;
  return val.reader;
}

export function* get<St>(): S<St, St> {
  const _val = yield { cmd: "GET" } as YieldVal<never, never, St, never, false>;
  const val = _val as unknown as YieldNext<never, St>;
  return val.state;
}

export function* tell<Wt>(val: Wt): W<Wt> {
  yield { cmd: "TELL", val } as YieldVal<never, Wt, never, never, false>;
}

export function* put<St>(val: St): S<St> {
  yield { cmd: "PUT", val } as YieldVal<never, never, St, never, false>;
}

export function* fail<Et>(val: Et): E<Et> {
  yield { cmd: "FAIL", val } as YieldVal<never, never, never, Et, false>;
}

export function* waitFor<Et, Pt>(
  promise: Promise<Pt>,
  catcher: CatcherType<Et, Pt> = () => undefined,
): EA<Et, Pt> {
  const { awaited } = yield {
    cmd: "AWAIT",
    val: promise,
    catcher,
  } as YieldVal<never, never, never, Et, true>;
  return awaited;
}

export function* asks<Rt, Rr>(f: (s: Rt) => Rr): R<Rt, Rr> {
  const v = yield* ask();
  return f(v);
}

export function* gets<St, Rr>(f: (s: St) => Rr): S<St, Rr> {
  const v = yield* get();
  return f(v);
}

export function* mutate<St>(f: (s: Draft<St>) => void): S<St, boolean> {
  const curr = yield* get();
  const next = create(curr, (d) => {
    f(d);
  });
  if (curr == next) {
    return false;
  }
  yield* put(next);
  return true;
}

type StackFns_<R, W, S, E, A extends boolean> = {
  stating<S2, Res>(
    initialState: S2,
    m: RWSE$G_<Res, R, W, S2, E, A>,
  ): RWSE$G_<[S2, Res], R, W, S, E, A>;
  writing<W2, Res>(
    joinWrites: (...ws: W2[]) => W2,
    m: RWSE$G_<Res, R, W2, S, E, A>,
  ): RWSE$G_<[W2, Res], R, W, S, E, A>;
  reading<R2, Res>(
    reader: R2,
    m: RWSE$G_<Res, R2, W, S, E, A>,
  ): RWSE$G_<Res, R, W, S, E, A>;
  catching<E2, Res>(
    catcher: (e: E2) => $.Either<Res, E>,
    m: RWSE$G_<Res, R, W, S, E2, A>,
  ): RWSE$G_<Res, R, W, S, E, A>;
} & ([S] extends [never]
  ? {}
  : {
      get: typeof get<S>;
      put: typeof put<S>;
      mutate: typeof mutate<S>;
      gets: <T>(f: (s: S) => T) => RWSE$G<T, never, never, S, never>;
    }) &
  ([R] extends [never]
    ? {}
    : {
        asks: <T>(f: (r: R) => T) => RWSE$G<T, R, never, never, never>;
        ask: typeof ask<R>;
      }) &
  ([W] extends [never]
    ? {}
    : {
        tell: typeof tell<W>;
      }) &
  ([E] extends [never]
    ? {}
    : {
        fail: typeof fail<E>;
      }) &
  ([A] extends [false]
    ? {}
    : {
        waitFor: <Pt>(
          promise: Promise<Pt>,
          catcher?: CatcherType<E, Pt>,
        ) => RWSE$GA<Pt, never, never, never, E>;
      });

type StackFns<R, W, S, E> = StackFns_<R, W, S, E, false>;

type StackFnsA<R, W, S, E> = StackFns_<R, W, S, E, true>;

export type ExecRes<W, S, E, Res> = $.Either<Res, E> & { state: S; written: W };

type CatcherType<Err, Res> = (e: any) => undefined | $.Either<Res, Err>;

type StackConfig_full<R, W, S> = {
  initialState?: S;
  joinWriters?: (...ws: W[]) => W;
  reader?: R;
};

class StackConfigClass<R, W, S> {
  initialState: S;
  joinWriters: (...ws: W[]) => W;
  reader: R;
  constructor(initialState: S, joinWriters: (...ws: W[]) => W, reader: R) {
    this.initialState = initialState;
    this.joinWriters = joinWriters;
    this.reader = reader;
  }

  _r<R2>(r: R2): StackConfigClass<R2, W, S> {
    return new StackConfigClass(this.initialState, this.joinWriters, r);
  }

  _w<W2>(joinWriters: (...ws: W2[]) => W2): StackConfigClass<R, W2, S> {
    return new StackConfigClass(this.initialState, joinWriters, this.reader);
  }

  _s<S2>(initialState: S2): StackConfigClass<R, W, S2> {
    return new StackConfigClass(initialState, this.joinWriters, this.reader);
  }

  exec<E, Res>(m: RWSE$G<Res, R, W, S, E>): ExecRes<W, S, E, Res> {
    return exec(m, this);
  }

  execAsync<E, Res>(
    m: RWSE$GA<Res, R, W, S, E>,
  ): Promise<ExecRes<W, S, E, Res>> {
    return execAsync(m, this);
  }
}

const STACK = new StackConfigClass<never, never, never>(
  undefined as unknown as never,
  undefined as unknown as (...ns: never[]) => never,
  undefined as unknown as never,
);

export const r = <R>(r: R) => STACK._r(r);
export const rw = <R, W>(r: R, w: (...ws: W[]) => W) => STACK._r(r)._w(w);
export const rs = <R, S>(r: R, s: S) => STACK._r(r)._s(s);
export const rws = <R, W, S>(r: R, w: (...ws: W[]) => W, s: S) =>
  STACK._r(r)._w(w)._s(s);
export const w = <W>(w: (...ws: W[]) => W) => STACK._w(w);
export const ws = <W, S>(w: (...ws: W[]) => W, s: S) => STACK._w(w)._s(s);
export const s = <S>(s: S) => STACK._s(s);

export function* reading<R2, R, W, S, E, A extends boolean, Res>(
  reader: R2,
  m: RWSE$G_<Res, R2, W, S, E, A>,
): RWSE$G_<Res, R, W, S, E, A> {
  let awaited: any;
  const g = m;
  while (true) {
    const state = yield* get();
    const result = g.next({
      state,
      reader,
      awaited,
    });
    if (result.done) {
      return result.value;
    } else {
      awaited = yield result.value as YieldVal<R, W, S, E, A>;
    }
  }
}

export function* writing<W2, R, W, S, E, A extends boolean, Res>(
  joinWrites: (...ws: W2[]) => W2,
  m: RWSE$G_<Res, R, W2, S, E, A>,
): RWSE$G_<[W2, Res], R, W, S, E, A> {
  let awaited: any;
  const g = m;
  const reader = yield* ask();
  const writes: W2[] = [];
  while (true) {
    const state = yield* get();
    const result = g.next({
      state,
      reader,
      awaited,
    });
    if (result.done) {
      return [joinWrites(...writes), result.value];
    } else {
      if (result.value.cmd === "TELL") {
        writes.push(result.value.val);
      } else {
        awaited = yield result.value as YieldVal<R, never, S, E, A>;
      }
    }
  }
}

export function* stating<S2, R, W, S, E, A extends boolean, Res>(
  initialState: S2,
  m: RWSE$G_<Res, R, W, S2, E, A>,
): RWSE$G_<[S2, Res], R, W, S, E, A> {
  let awaited: any;
  const g = m;
  const reader = yield* ask();
  let state = initialState;
  while (true) {
    const result = g.next({
      state,
      reader,
      awaited,
    });
    if (result.done) {
      return [state, result.value];
    } else {
      if (result.value.cmd === "PUT") {
        state = result.value.val;
      } else {
        awaited = yield result.value as YieldVal<R, never, S, E, A>;
      }
    }
  }
}

export function* catching<E2, R, W, S, E, A extends boolean, Res>(
  catcher: (e: E2) => $.Either<Res, E>,
  m: RWSE$G_<Res, R, W, S, E2, A>,
): RWSE$G_<Res, R, W, S, E, A> {
  let awaited: any;
  const g = m;
  const reader = yield* ask();
  while (true) {
    const state = yield* get();
    const result = g.next({
      state,
      reader,
      awaited,
    });
    if (result.done) {
      return result.value;
    } else {
      if (result.value.cmd === "FAIL") {
        const caught = catcher(result.value.val);
        if (caught.isOk) {
          return caught.res;
        } else {
          yield { cmd: "FAIL", val: caught.err } as YieldVal<R, W, S, E, A>;
        }
      } else {
        awaited = yield result.value as YieldVal<R, W, S, never, A>;
      }
    }
  }
}

export function exec<R, W, S, E, Res>(
  m: RWSE$G<Res, R, W, S, E>,
  stackCfg: StackConfigClass<R, W, S>,
): ExecRes<W, S, E, Res> {
  let res: undefined | ExecRes<W, S, E, Res> = undefined;
  execRaw(m, stackCfg, (finalRes) => (res = finalRes));
  if (!res) {
    throw "non-terminated rwse monad";
  }
  return res;
}

async function execRaw<R, W, S, E, A extends boolean, Res>(
  m: RWSE$G_<Res, R, W, S, E, A>,
  stackCfg: StackConfigClass<R, W, S>,
  onDone: (er: ExecRes<W, S, E, Res>) => void,
): Promise<void> {
  const stack = stackCfg as StackConfig_full<R, W, S>;
  function joinWrites(ws: W[]): W {
    if (stack.joinWriters) {
      return stack.joinWriters(...ws);
    }
    return undefined as unknown as W;
  }

  const writes: W[] = [];
  let state = stack.initialState as S;
  let awaited: any;
  const g = m;
  while (true) {
    const result = g.next({
      state,
      reader: stack.reader as R,
      awaited,
    });
    if (result.done) {
      return onDone({
        state,
        written: joinWrites(writes),
        isOk: true,
        res: result.value,
        err: null,
      });
    } else {
      const y = result.value;
      if (y.cmd === "TELL") {
        writes.push(y.val);
      } else if (y.cmd === "PUT") {
        state = y.val;
      } else if (y.cmd === "FAIL") {
        return onDone({
          state,
          written: joinWrites(writes),
          isOk: false,
          err: y.val,
          res: null,
        });
      } else if (y.cmd === "AWAIT") {
        try {
          awaited = await y.val;
        } catch (err) {
          if (!y.catcher) {
            throw err;
          }
          const caughtVal = y.catcher(err);
          if (!caughtVal) {
            throw err;
          } else if (!caughtVal.isOk) {
            return onDone({
              state,
              written: joinWrites(writes),
              isOk: false,
              res: null,
              err: caughtVal.err,
            });
          } else {
            awaited = caughtVal.res;
          }
        }
      }
    }
  }
}

export function execAsync<R, W, S, E, Res>(
  m: RWSE$GA<Res, R, W, S, E>,
  stackCfg: StackConfigClass<R, W, S>,
): Promise<ExecRes<W, S, E, Res>> {
  return new Promise((resolve) => execRaw(m, stackCfg, resolve));
}

function _Do<R, W, S, E, Res = void, Args extends any[] = []>(
  f: (stkFns: StackFns<R, W, S, E>, ...args: Args) => RWSE$G<Res, R, W, S, E>,
): (...args: Args) => RWSE$G<Res, R, W, S, E> {
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
    waitFor,
  };
  return (...args: Args) => f(stkFns, ...args);
}

type _Do<R, W, S, E, Res, Args extends any[]> = typeof _Do<
  R,
  W,
  S,
  E,
  Res,
  Args
>;

function _DoA<R, W, S, E, Res = void, Args extends any[] = []>(
  f: (stkFns: StackFnsA<R, W, S, E>, ...args: Args) => RWSE$GA<Res, R, W, S, E>,
): (...args: Args) => RWSE$GA<Res, R, W, S, E> {
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
    waitFor,
  };
  return (...args: Args) => f(stkFns, ...args);
}

type _DoA<R, W, S, E, Res, Args extends any[]> = typeof _DoA<
  R,
  W,
  S,
  E,
  Res,
  Args
>;

export function DoR<R, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, never, never, Res, Args>>
) {
  return _Do(...args);
}
export function DoR_<R, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, never, never, void, Args>>
) {
  return _Do(...args);
}

export function DoW<W, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, never, never, Res, Args>>
) {
  return _Do(...args);
}
export function DoW_<W, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, never, never, void, Args>>
) {
  return _Do(...args);
}

export function DoS<S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<never, never, S, never, Res, Args>>
) {
  return _Do(...args);
}
export function DoS_<S, Args extends any[] = []>(
  ...args: Parameters<_Do<never, never, S, never, void, Args>>
) {
  return _Do(...args);
}

export function DoE<E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<never, never, never, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoE_<E, Args extends any[] = []>(
  ...args: Parameters<_Do<never, never, never, E, void, Args>>
) {
  return _Do(...args);
}

export function DoRW<R, W, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, never, never, Res, Args>>
) {
  return _Do(...args);
}
export function DoRW_<R, W, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, never, never, void, Args>>
) {
  return _Do(...args);
}

export function DoRS<R, S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, S, never, Res, Args>>
) {
  return _Do(...args);
}
export function DoRS_<R, S, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, S, never, void, Args>>
) {
  return _Do(...args);
}

export function DoRE<R, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, never, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoRE_<R, E, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, never, E, void, Args>>
) {
  return _Do(...args);
}

export function DoRWS<R, W, S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, S, never, Res, Args>>
) {
  return _Do(...args);
}
export function DoRWS_<R, W, S, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, S, never, void, Args>>
) {
  return _Do(...args);
}

export function DoRWE<R, W, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, never, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoRWE_<R, W, E, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, never, E, void, Args>>
) {
  return _Do(...args);
}

export function DoRSE<R, S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, S, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoRSE_<R, S, E, Args extends any[] = []>(
  ...args: Parameters<_Do<R, never, S, E, void, Args>>
) {
  return _Do(...args);
}

export function DoRWSE<R, W, S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, S, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoRWSE_<R, W, S, E, Args extends any[] = []>(
  ...args: Parameters<_Do<R, W, S, E, void, Args>>
) {
  return _Do(...args);
}

export function DoWS<W, S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, S, never, Res, Args>>
) {
  return _Do(...args);
}
export function DoWS_<W, S, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, S, never, void, Args>>
) {
  return _Do(...args);
}

export function DoWE<W, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, never, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoWE_<W, E, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, never, E, void, Args>>
) {
  return _Do(...args);
}

export function DoWSE<W, S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, S, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoWSE_<W, S, E, Args extends any[] = []>(
  ...args: Parameters<_Do<never, W, S, E, void, Args>>
) {
  return _Do(...args);
}

export function DoSE<S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_Do<never, never, S, E, Res, Args>>
) {
  return _Do(...args);
}
export function DoSE_<S, E, Args extends any[] = []>(
  ...args: Parameters<_Do<never, never, S, E, void, Args>>
) {
  return _Do(...args);
}

export function DoRA<R, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, never, never, Res, Args>>
) {
  return _DoA(...args);
}
export function DoRA_<R, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, never, never, void, Args>>
) {
  return _DoA(...args);
}

export function DoWA<W, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, never, never, Res, Args>>
) {
  return _DoA(...args);
}
export function DoWA_<W, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, never, never, void, Args>>
) {
  return _DoA(...args);
}

export function DoSA<S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, never, S, never, Res, Args>>
) {
  return _DoA(...args);
}
export function DoSA_<S, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, never, S, never, void, Args>>
) {
  return _DoA(...args);
}

export function DoEA<E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, never, never, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoEA_<E, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, never, never, E, void, Args>>
) {
  return _DoA(...args);
}

export function DoRWA<R, W, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, never, never, Res, Args>>
) {
  return _DoA(...args);
}
export function DoRWA_<R, W, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, never, never, void, Args>>
) {
  return _DoA(...args);
}

export function DoRSA<R, S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, S, never, Res, Args>>
) {
  return _DoA(...args);
}
export function DoRSA_<R, S, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, S, never, void, Args>>
) {
  return _DoA(...args);
}

export function DoREA<R, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, never, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoREA_<R, E, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, never, E, void, Args>>
) {
  return _DoA(...args);
}

export function DoRWSA<R, W, S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, S, never, Res, Args>>
) {
  return _DoA(...args);
}
export function DoRWSA_<R, W, S, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, S, never, void, Args>>
) {
  return _DoA(...args);
}

export function DoRWEA<R, W, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, never, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoRWEA_<R, W, E, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, never, E, void, Args>>
) {
  return _DoA(...args);
}

export function DoRSEA<R, S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, S, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoRSEA_<R, S, E, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, never, S, E, void, Args>>
) {
  return _DoA(...args);
}

export function DoRWSEA<R, W, S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, S, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoRWSEA_<R, W, S, E, Args extends any[] = []>(
  ...args: Parameters<_DoA<R, W, S, E, void, Args>>
) {
  return _DoA(...args);
}

export function DoWSA<W, S, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, S, never, Res, Args>>
) {
  return _DoA(...args);
}
export function DoWSA_<W, S, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, S, never, void, Args>>
) {
  return _DoA(...args);
}

export function DoWEA<W, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, never, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoWEA_<W, E, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, never, E, void, Args>>
) {
  return _DoA(...args);
}

export function DoWSEA<W, S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, S, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoWSEA_<W, S, E, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, W, S, E, void, Args>>
) {
  return _DoA(...args);
}

export function DoSEA<S, E, Res = void, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, never, S, E, Res, Args>>
) {
  return _DoA(...args);
}
export function DoSEA_<S, E, Args extends any[] = []>(
  ...args: Parameters<_DoA<never, never, S, E, void, Args>>
) {
  return _DoA(...args);
}
