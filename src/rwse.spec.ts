import { describe, expect, it } from "vitest";
import * as $ from "./rwse.js";
import type { Draft } from "mutative";

describe("rwse", () => {
  it("should work", () => {
    const stack = $.Stack({ k: "v" }, [420], (...ss: string[]) => ss.join(" "));
    function* impl() {
      yield* $.mutate((s: Draft<number[]>) => s.push(69));
      yield* $.tell("getK");
      const { k } = yield* $.ask<{ k: string }>();
      yield* $.tell(`k=[${k}]`);
      return yield* $.gets<number[], string>((els) => els.join("|"));
    }
    const res = stack.exec(impl);
    expect(res.written).toBe("getK k=[v]");
    expect(res.res).toBe("420|69");
  });
});
