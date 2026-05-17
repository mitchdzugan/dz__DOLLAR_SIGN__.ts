import { create, type Draft } from "mutative";

type YieldVal<R, W, S, E> =
  | ([R] extends [never] ? { cmd: "NOOP" } : { cmd: "ASK"; ID: (r: R) => R })
  | ([S] extends [never] ? { cmd: "NOOP" } : { cmd: "GET" })
  | ([S] extends [never] ? { cmd: "NOOP" } : { cmd: "PUT"; val: S })
  | ([E] extends [never] ? { cmd: "NOOP" } : { cmd: "FAIL"; val: E })
  | ([W] extends [never] ? { cmd: "NOOP" } : { cmd: "TELL"; val: W });

type YieldValA<R, W, S, E> =
  | YieldVal<R, W, S, E>
  | { cmd: "AWAIT"; val: Promise<any> };

type YieldNext<R, S> = ([R] extends [never] ? { reader: any } : { reader: R }) &
  ([S] extends [never] ? { state: any } : { state: S }) & { awaited: any };

type RWSE$G<M, R, W, S, E> = Generator<
  YieldVal<R, W, S, E>,
  M,
  YieldNext<R, S>
>;

type RWSE$GA<M, R, W, S, E> = Generator<
  YieldValA<R, W, S, E>,
  M,
  YieldNext<R, S>
>;

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
  const _val = yield { cmd: "ASK" } as YieldVal<Rt, never, never, never>;
  const val = _val as unknown as YieldNext<Rt, never>;
  return val.reader;
}

export function* get<St>(): S<St, St> {
  const _val = yield { cmd: "GET" } as YieldVal<never, never, St, never>;
  const val = _val as unknown as YieldNext<never, St>;
  return val.state;
}

export function* tell<Wt>(val: Wt): W<Wt> {
  yield { cmd: "TELL", val } as YieldVal<never, Wt, never, never>;
}

export function* put<St>(val: St): S<St> {
  yield { cmd: "PUT", val } as YieldVal<never, never, St, never>;
}

export function* fail<Et>(val: Et): E<Et> {
  yield { cmd: "FAIL", val } as YieldVal<never, never, never, Et>;
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

export type Either<R, E> =
  | { isOk: true; res: R; err: undefined }
  | { isOk: false; err: E; res: undefined };
export type ExecRes<W, S, E, Res> = Either<Res, E> & { state: S; written: W };

type StackConfig<R, W, S> = ([R] extends [never] ? {} : { reader: R }) &
  ([S] extends [never] ? {} : { initialState: S }) &
  ([W] extends [never] ? {} : { joinWriters: (...ws: W[]) => W });

type StackConfig_full<R, W, S> = {
  initialState?: S;
  joinWriters?: (...ws: W[]) => W;
  reader?: R;
};

export function StackConfig<R, W, S>(
  cfg: StackConfig<R, W, S>,
): StackConfig<R, W, S> {
  return cfg;
}

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
}

export const $ = new StackConfigClass<never, never, never>(
  undefined as unknown as never,
  undefined as unknown as (...ns: never[]) => never,
  undefined as unknown as never,
);

export function exec<R, W, S, E, Res>(
  m: RWSE$G<Res, R, W, S, E>,
  stackCfg: StackConfigClass<R, W, S>,
): ExecRes<W, S, E, Res> {
  const stack = stackCfg as StackConfig_full<R, W, S>;
  function joinWrites(ws: W[]): W {
    if (stack.joinWriters) {
      return stack.joinWriters(...ws);
    }
    return undefined as unknown as W;
  }

  const writes: W[] = [];
  let state = stack.initialState as S;
  const g = m;
  while (true) {
    const result = g.next({
      state,
      reader: stack.reader as R,
      awaited: null,
    });
    if (result.done) {
      return {
        state,
        written: joinWrites(writes),
        isOk: true,
        res: result.value,
        err: undefined,
      };
    } else {
      const y = result.value;
      if (y.cmd === "TELL") {
        writes.push(y.val);
      } else if (y.cmd === "PUT") {
        state = y.val;
      } else if (y.cmd === "FAIL") {
        return {
          state,
          written: joinWrites(writes),
          isOk: false,
          err: y.val,
          res: undefined,
        };
      }
    }
  }
}

abstract class Stack<Rt, Wt, St, Et, Res = void, Args extends any[] = []> {
  get ask(): RWSE$G<Rt, Rt, Wt, St, Et> {
    return ask() as RWSE$G<Rt, Rt, Wt, St, Et>;
  }
  gets<Rr>(f: (s: St) => Rr): RWSE$G<Rr, Rt, Wt, St, Et> {
    return gets(f) as RWSE$G<Rr, Rt, Wt, St, Et>;
  }
  mutate(f: (s: Draft<St>) => void): RWSE$G<boolean, Rt, Wt, St, Et> {
    return mutate(f) as RWSE$G<boolean, Rt, Wt, St, Et>;
  }
  tell(w: Wt): RWSE$G<void, Rt, Wt, St, Et> {
    return tell(w) as RWSE$G<void, Rt, Wt, St, Et>;
  }
  abstract $(...args: Args): RWSE$G<Res, Rt, Wt, St, Et>;
}

export abstract class StackR<
  R,
  Res = void,
  Args extends any[] = [],
> extends Stack<R, never, never, never, Res, Args> {}
export abstract class StackW<
  W,
  Res = void,
  Args extends any[] = [],
> extends Stack<never, W, never, never, Res, Args> {}
export abstract class StackS<
  S,
  Res = void,
  Args extends any[] = [],
> extends Stack<never, never, S, never, Res, Args> {}
export abstract class StackE<
  E,
  Res = void,
  Args extends any[] = [],
> extends Stack<never, never, never, E, Res, Args> {}

export abstract class StackRW<
  R,
  W,
  Res = void,
  Args extends any[] = [],
> extends Stack<R, W, never, never, Res, Args> {}
export abstract class StackRS<
  R,
  S,
  Res = void,
  Args extends any[] = [],
> extends Stack<R, never, S, never, Res, Args> {}
export abstract class StackRE<
  R,
  E,
  Res = void,
  Args extends any[] = [],
> extends Stack<R, never, never, E, Res, Args> {}

export abstract class StackRWS<
  R,
  W,
  S,
  Res = void,
  Args extends any[] = [],
> extends Stack<R, W, S, never, Res, Args> {}

export function Do<R, W, S, E, Res = void, Args extends any[] = []>(
  Mclass: new () => Stack<R, W, S, E, Res, Args>,
): (...args: Args) => RWSE$G<Res, R, W, S, E> {
  const m = new Mclass();
  return (...args: Args) => m.$(...args);
}

/*
export type Stack<R, W, S> = StackConfig<R, W, S> & {
  exec<E, Res>(m: () => RWSE$G<Res, R, W, S, E>): ExecRes<W, S, E, Res>;
};

export function Stack<R, W, S>(stackCfg: StackConfig<R, W, S>) {
  return {
    ...stackCfg,
    exec<E, Res>(m: () => RWSE$G<Res, R, W, S, E>): ExecRes<W, S, E, Res> {
      return exec(stackCfg, m);
    },
  };
}
*/
