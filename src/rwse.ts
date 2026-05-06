import { type Draft } from "mutative";
import { create } from "mutative";

type YieldNext<R, S> = {
  reader: R;
  state: S;
  awaited: any;
};

type YieldVal<W, S, E> =
  | { cmd: "ASK" }
  | { cmd: "TELL"; val: W }
  | { cmd: "GET" }
  | { cmd: "PUT"; val: S }
  | { cmd: "FAIL"; val: E };

type CatcherResType<Err, Res> = undefined | ["f", Err] | ["r", Res];
type CatcherType<Err, Res> = (
  e: any,
  fns: {
    ok: (r: Res) => CatcherResType<Err, Res>;
    err: (e: Err) => CatcherResType<Err, Res>;
  },
) => CatcherResType<Err, Res>;

type YieldValAsync<W, S, E> =
  | YieldVal<W, S, E>
  | {
      cmd: "WAIT_FOR";
      val: Promise<any>;
      catcher: CatcherType<E, any>;
    };

export type RWSE<R, W, S, E, Res> = Generator<
  YieldVal<W, S, E>,
  Res,
  YieldNext<R, S>
>;
export type RWSEA<R, W, S, E, Res> = Generator<
  YieldValAsync<W, S, E>,
  Res,
  YieldNext<R, S>
>;

export type R<Rt, Res> = RWSE<Rt, any, any, any, Res>;
export type W<Wt, Res> = RWSE<any, Wt, any, any, Res>;
export type S<St, Res> = RWSE<any, any, St, any, Res>;
export type E<Et, Res> = RWSE<any, any, any, Et, Res>;
export type RA<Rt, Res> = RWSEA<Rt, any, any, any, Res>;
export type WA<Wt, Res> = RWSEA<any, Wt, any, any, Res>;
export type SA<St, Res> = RWSEA<any, any, St, any, Res>;
export type EA<Et, Res> = RWSEA<any, any, any, Et, Res>;

export type RW<Rt, Wt, Res> = RWSE<Rt, Wt, any, any, Res>;
export type RS<Rt, St, Res> = RWSE<Rt, any, St, any, Res>;
export type RE<Rt, Et, Res> = RWSE<Rt, any, any, Et, Res>;
export type RWA<Rt, Wt, Res> = RWSEA<Rt, Wt, any, any, Res>;
export type RSA<Rt, St, Res> = RWSEA<Rt, any, St, any, Res>;
export type REA<Rt, Et, Res> = RWSEA<Rt, any, any, Et, Res>;

type Either<R, E> =
  | { isOk: true; res: R; err: undefined }
  | { isOk: false; err: E; res: undefined };
type ExecRes<W, S, E, Res> = Either<Res, E> & { state: S; written: W };

export function* ask<R>(): RWSE<R, any, any, any, R> {
  const { reader } = yield { cmd: "ASK" };
  return reader;
}

export function* tell<W>(w: W): RWSE<any, W, any, any, void> {
  yield { cmd: "TELL", val: w };
}

export function* get<S>(): RWSE<any, any, S, any, S> {
  const { state } = yield { cmd: "GET" };
  return state;
}

export function* put<S>(s: S): RWSE<any, any, S, any, void> {
  yield { cmd: "PUT", val: s };
}

export function* fail<E>(e: E): RWSE<any, any, any, E, void> {
  yield { cmd: "FAIL", val: e };
}

export function* waitFor<E, P>(
  promise: Promise<P>,
  catcher: CatcherType<E, P> = () => undefined,
): RWSEA<any, any, any, E, P> {
  const { awaited } = yield { cmd: "WAIT_FOR", val: promise, catcher };
  return awaited;
}

export function* asks<R, Res>(f: (r: R) => Res): RWSE<R, any, any, any, Res> {
  const reader = yield* ask();
  return f(reader);
}

export function* gets<S, Res>(f: (s: S) => Res): RWSE<any, any, S, any, Res> {
  const reader = yield* get();
  return f(reader);
}

export function* mutate<S>(
  f: (d: Draft<S>) => void,
): RWSE<any, any, S, any, boolean> {
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

type Stack<R, W, S> = {
  reader: R;
  initialState: S;
  joinWriters(...ws: W[]): W;
  exec<E, Res>(m: () => RWSE<R, W, S, E, Res>): ExecRes<W, S, E, Res>;
  execAsync<E, Res>(
    m: () => RWSEA<R, W, S, E, Res>,
  ): Promise<ExecRes<W, S, E, Res>>;
};

export function exec<R, W, S, E, Res>(
  stack: Stack<R, W, S>,
  m: () => RWSE<R, W, S, E, Res>,
): ExecRes<W, S, E, Res> {
  const reader: R = stack.reader;
  const writes: W[] = [];
  let state: S = stack.initialState;
  const g = m();
  while (true) {
    const result = g.next({
      state,
      reader,
      awaited: null,
    });
    if (result.done) {
      return {
        state,
        written: stack.joinWriters(...writes),
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
          written: stack.joinWriters(...writes),
          isOk: false,
          err: y.val,
          res: undefined,
        };
      }
    }
  }
}

export async function execAsync<R, W, S, E, Res>(
  stack: Stack<R, W, S>,
  m: () => RWSEA<R, W, S, E, Res>,
): Promise<ExecRes<W, S, E, Res>> {
  const writes: W[] = [];
  let state: S = stack.initialState;
  let awaited: any;
  const g = m();
  while (true) {
    const result = g.next({ state, reader: stack.reader, awaited });
    if (result.done) {
      return {
        state,
        written: stack.joinWriters(...writes),
        isOk: true,
        err: undefined,
        res: result.value,
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
          written: stack.joinWriters(...writes),
          isOk: false,
          res: undefined,
          err: y.val,
        };
      } else if (y.cmd === "WAIT_FOR") {
        try {
          awaited = await y.val;
        } catch (err) {
          const [catchType, catchVal] =
            y.catcher(err, {
              ok: (r) => ["r", r],
              err: (e) => ["f", e],
            }) || [];
          if (!catchType) {
            throw err;
          } else if (catchType === "f") {
            return {
              state,
              written: stack.joinWriters(...writes),
              isOk: false,
              res: undefined,
              err: catchVal,
            };
          } else {
            awaited = catchVal;
          }
        }
      }
    }
  }
}

export function Stack<R, W, S>(
  reader: R,
  initialState: S,
  joinWriters: (...ws: W[]) => W,
): Stack<R, W, S> {
  const stack: Stack<R, W, S> = {
    reader,
    initialState,
    joinWriters,
    exec: (m) => exec(stack, m),
    execAsync: (m) => execAsync(stack, m),
  };
  return stack;
}

export type M$<S extends Stack<any, any, any>, E, Res> = RWSE<
  S["reader"],
  S["initialState"],
  ReturnType<S["joinWriters"]>,
  E,
  Res
>;
