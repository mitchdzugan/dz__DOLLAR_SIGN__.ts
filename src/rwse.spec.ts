import { describe, expect, it } from "vitest";
import * as $ from "./index.js";

const impl: <T>(t: T) => $.RWS<{ k: string }, string, T[], string> = (<T>() =>
  $.DoRWS<{ k: string }, string, T[], string, [T]>(function* (M, t) {
    yield* M.tell("getK");
    yield* M.mutate((s) => s.push(t as $.Arg1<typeof s.push>));
    const { k } = yield* M.ask();
    yield* M.tell(`k=[${k}]`);
    // yield* M.fail(23);
    return yield* M.gets((els) => els.join("|"));
  }))();

const implInner = $.DoRW<string, string>(function* (M) {
  const msg = yield* M.ask();
  yield* M.tell(msg);
});

const impl2 = $.DoRWSE<
  { k: string },
  string,
  number[],
  number,
  string,
  [number]
>(function* (M, t) {
  yield* M.reading("getK", implInner());
  yield* M.mutate((s) => s.push(t));
  const { k } = yield* M.ask();
  yield* M.tell(`k=[${k}]`);
  if (k === "E") {
    yield* M.fail(23);
  }
  return yield* M.gets((els) => els.join("|"));
});

const implA = $.DoRWSEA<
  { k: string },
  string,
  number[],
  number,
  string,
  [number]
>(function* (M, t) {
  const msg = yield* M.waitFor(Promise.resolve("getK"));
  yield* M.tell(msg);
  yield* M.mutate((s) => s.push(t));
  const { k } = yield* M.ask();
  yield* M.tell(`k=[${k}]`);
  if (k === "E") {
    yield* M.fail(23);
  }
  return yield* M.gets((els) => els.join("|"));
});

describe("rwse", () => {
  it("should work", () => {
    const res = $.rws({ k: "v" }, (...s: string[]) => s.join(" "), [420]).exec(
      impl(69),
    );
    expect(res.written).toBe("getK k=[v]");
    expect(res.res).toBe("420|69");
    const res2 = $.rws({ k: "v" }, (...s: string[]) => s.join(" "), [420]).exec(
      impl2(69),
    );
    expect(res2.written).toBe("getK k=[v]");
    expect(res2.res).toBe("420|69");
  });
  it("should work async", async () => {
    const res = await $.rws(
      { k: "v" },
      (...s: string[]) => s.join(" "),
      [420],
    ).execAsync(implA(69));
    expect(res.written).toBe("getK k=[v]");
    expect(res.res).toBe("420|69");
  });
});
