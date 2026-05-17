import { describe, expect, it } from "vitest";
import * as $ from "./rwse2.js";

function ID<T>(a: T): T {
  return a;
}

type MyFn = <T>(this: { a: number }, t: T) => T;
type MyFn_Clean = <T>(t: T) => T;

/*
const impl: <T>(t: T) => $.RS<{ k: string }, number[], T> = (<T>() =>
  ID(function* __impl(t: T) {
    yield* $.mutate((s) => s.push(69));
    // yield* impl2();
    const { k } = yield* $.ask<{ k: string }>();
    // yield* $.tell(`k=[${k}]`);
    // yield* M.fail(23);
    console.log({ k, t });
    yield* $.gets((els) => els.join("|"));
    return t;
  }))();
*/
type R = { k: string };
type S = number[];
const impl2 = $.Do(
  class extends $.StackRS<R, S, number, [number]> {
    *$(t: number) {
      yield* this.mutate((s) => s.push(69));
      const { k } = yield* this.ask;
      // yield* this.tell(`k=[${k}]`);
      // yield* M.fail(23);
      console.log({ k, t });
      console.log(yield* this.gets((els) => els.join("|")));
      return t;
    }
  },
);
const impl: <T>(t: T) => $.RWS<{ k: string }, string, number[], T> = (<T>() =>
  $.Do(
    class extends $.StackRWS<{ k: string }, string, number[], T, [T]> {
      *$(t: T) {
        yield* this.mutate((s) => s.push(69));
        const { k } = yield* this.ask;
        yield* this.tell(`k=[${k}]`);
        // yield* M.fail(23);
        console.log({ k, t });
        console.log(yield* this.gets((els) => els.join("|")));
        return t;
      }
    },
  ))();

describe("rwse", () => {
  it("should work", () => {
    const res = $.$._r({ k: "v" })
      ._w((...s: string[]) => s.join(" "))
      ._s([420])
      .exec(impl<number>(1));
    const res2 = $.$._r({ k: "v" })
      ._w((...s: string[]) => s.join(" "))
      ._s([420])
      .exec(impl2(1));
    expect(res2.written).toBe("getK k=[v]");
    expect(res2.res).toBe("420|69");
    expect(res.written).toBe("getK k=[v]");
    expect(res.res).toBe("420|69");
  });
});

function wrap(f: MyFn): MyFn_Clean {
  return f.bind({ a: 2 }) as MyFn_Clean;
}

wrap(function <T>(this: { a: number }, t: T) {
  console.log(this.a);
  return t;
});
