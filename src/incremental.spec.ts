import { describe, expect, it } from "vitest";
import * as $ from "./index.js";
import { create } from "mutative";

type WorkOpts = {
  swaps: (ns: [number, number][]) => void;
  lookup: (n: number) => string;
};

const BASE_SIZE = 100000;

function doWork(workOpts: WorkOpts): [string, number] {
  const rng = $.psuedoRng(100);
  const randomInd = () => Math.floor(rng() * BASE_SIZE);
  let res = "";
  const startTime = performance.now();
  const swaps: [number, number][] = [];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 20; i++) {
      const n1 = randomInd();
      const n2 = randomInd();
      swaps.push([n1, n2]);
    }
    workOpts.swaps(swaps);
  }
  for (let i = 0; i < 10; i++) {
    res += ":" + workOpts.lookup(randomInd());
  }
  return [res, performance.now() - startTime];
}

function doWork1() {
  const baseDict: Record<number, string> = {};
  for (let i = 0; i < BASE_SIZE; i++) {
    baseDict[i] = `${i}`;
  }
  let currDict = baseDict;
  function swaps(ns: [number, number][]) {
    currDict = create(currDict, (draft) => {
      for (const [n1, n2] of ns) {
        const tmp = currDict[n1] || "";
        draft[n1] = currDict[n2] || "";
        draft[n2] = tmp;
      }
    });
  }
  function lookup(n: number) {
    return currDict[n] || "";
  }
  return doWork({ swaps, lookup });
}

function doWork2() {
  const baseDict = $.Inc.Ider.Num.Dict().mutate((fns) => {
    for (let i = 0; i < BASE_SIZE; i++) {
      fns.set(i, `${i}`);
    }
  });
  let currDict = baseDict;
  function swaps(ns: [number, number][]) {
    currDict = currDict.mutate((fns) => {
      for (const [n1, n2] of ns) {
        const v1 = currDict.lookup(n1).case(
          (v) => v,
          () => "",
        );
        const v2 = currDict.lookup(n2).case(
          (v) => v,
          () => "",
        );
        fns.set(n1, v2);
        fns.set(n2, v1);
      }
    });
  }
  function lookup(n: number) {
    return currDict.lookup(n).case(
      (v) => v,
      () => "",
    ) as string;
  }
  return doWork({ swaps, lookup });
}

const zo = $.Inc.defZObj({ a: $.Proxy.Of<number>(), b: $.Proxy.Of<string>() });
const zv = $.Inc.defZVar({ a: $.Proxy.Of<number>(), b: $.Proxy.Of<string>() });

describe("incremental", () => {
  it("should work", () => {
    const [res1, t1] = doWork1();
    const [res2, t2] = doWork2();
    expect(res1).toBe(res2);
    expect(t1).toBeGreaterThan(t2);
    console.log("ZV", typeof $.Inc.mk(zv).b("1"));
    expect($.Inc.mk(zo)({ a: 1, b: "2" }).a).toBe(1);
  });
});
