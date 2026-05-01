import type { IdLiteral } from './id.js';

function idKey(id: IdLiteral): string {
  const valueString = id ? `${id}` : "";
  const typeString = `${typeof id}`;
  return `${typeString}|${valueString}`;
}

type Nilable<T extends {}> = T | null | undefined;
const optCase =
  <T extends {}, R>(onSome: (t: T) => R, onNone: () => R) =>
  (nilable: Nilable<T>) => {
    if (nilable !== undefined && nilable !== null) {
      return onSome(nilable);
    } else {
      return onNone();
    }
  };

class OptClass<T extends {}> {
  #isNil: boolean;
  #nilable: T | undefined | null;
  constructor(nilable: T | undefined | null = undefined) {
    this.#nilable = nilable;
    this.#isNil = optCase(
      () => false,
      () => true,
    )(nilable);
  }
  get isEmpty() {
    return this.#isNil;
  }
  case<R>(onSome: (t: T) => R, onNone: () => R): R {
    return optCase(onSome, onNone)(this.#nilable);
  }
  map<R extends {}>(f: (t: T) => R): OptClass<R> {
    return this.case(
      (v) => new OptClass(f(v)),
      () => new OptClass(),
    );
  }
  bind<R extends {}>(f: (t: T) => OptClass<R>): OptClass<R> {
    return this.case(
      (v) => f(v),
      () => new OptClass(),
    );
  }
  join<R extends {}>(rhs: OptClass<R>): OptClass<[T, R]> {
    return this.bind((l) => rhs.map((r) => [l, r] as [T, R]));
  }
}

type Opt<T extends {}> = OptClass<T>;
function Opt<T extends {}>(t: Nilable<T>): Opt<T> {
  return new OptClass(t);
}

interface DictMut_r<K, T extends {}> {
  delete(k: K): void;
  set(k: K, v: T): void;
}

type DictKeyMutation<V extends {}> = ["set", V] | ["del"];
type DictKeyMutations<K, V extends {}> = [
  K,
  Opt<V>,
  DictKeyMutation<V>,
  DictKeyMutation<V>[],
];
type DictMutations<K, V extends {}> = Record<string, DictKeyMutations<K, V>>;

interface Dict_r<K, T extends {}> {
  [Symbol.iterator](): Iterator<[K, T]>;
  lookup(k: K): Opt<T>;
  key(k: K): string;
  src: BaseDict_r<K, T>;
  changed: boolean;
  changes: DictKeyMutation<T>[];
  mutate(mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T>;
}

class BaseDict_r<K, T extends {}> implements Dict_r<K, T> {
  constructor() {}
  key(_k: K): string {
    throw "unimplemented";
  }
  [Symbol.iterator](): Iterator<[K, T]> {
    throw "unimplemented";
  }
  lookup(_k: K): Opt<T> {
    throw "unimplemented";
  }
  mutate(_mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T> {
    throw "unimplemented";
  }
  get src(): BaseDict_r<K, T> {
    throw "unimplemented";
  }
  get changes(): DictKeyMutation<T>[] {
    throw "unimplemented";
  }
  get changed(): boolean {
    return this.changes.length > 0;
  }
}

class MutatedDict<K, V extends {}> extends BaseDict_r<K, V> {
  #base: Dict_r<K, V>;
  #mutations: DictMutations<K, V>;
  #iterated?: [K, V][];

  constructor(base: Dict_r<K, V>, mutater: (dm: DictMut_r<K, V>) => void) {
    super();
    this.#base = base;
    this.#mutations = {};
    mutater({
      delete: (k: K) => this.delete(k),
      set: (k: K, v: V) => this.set(k, v),
    });
  }

  key(k: K) {
    return this.#base.key(k);
  }

  addMutation(k: K, m: DictKeyMutation<V>) {
    const id = this.key(k);
    const currMutation = this.#mutations[id];
    if (currMutation) {
      currMutation[3].push(currMutation[2]);
      currMutation[2] = m;
    } else {
      this.#mutations[id] = [k, this.lookup(k), m, []];
    }
  }

  delete(k: K) {
    this.addMutation(k, ["del"]);
  }

  set(k: K, v: V) {
    this.addMutation(k, ["set", v]);
  }

  [Symbol.iterator](): Iterator<[K, V]> {
    const self = this;
    const cachedIterated = self.#iterated;
    if (cachedIterated) {
      return (function* () {
        for (const next of cachedIterated) {
          yield next;
        }
      })();
    }
    const base = this.#base;
    const mutations: DictMutations<K, V> = this.#mutations;
    const setIterated = (iterated: [K, V][]) => (this.#iterated = iterated);
    return (function* () {
      const iterated = [];
      for (const next of base) {
        const [k] = next;
        const key = base.key(k);
        const mutation = mutations[key];
        if (!mutation) {
          iterated.push(next);
          yield next;
        }
      }
      for (const [k, _v, [mutationType, v]] of Object.values(mutations)) {
        if (mutationType === "del") {
          continue;
        }
        const next: [K, V] = [k, v];
        iterated.push(next);
        yield next;
      }
      setIterated(iterated);
    })();
  }

  lookup(k: K): Opt<V> {
    const id = this.key(k);
    return Opt<V>(undefined);
  }

  mutate(mutater: (dm: DictMut_r<K, V>) => void): Dict_r<K, V> {
    return new MutatedDict(this, mutater);
  }
}

class PureDict_r<K, T extends {}> extends BaseDict_r<K, T> {
  #data: Record<string, [K, T]> = {};
  #idImplK: (k: K) => IdLiteral;

  constructor(idImplK: (k: K) => IdLiteral, entries: Iterable<[K, T]>) {
    super();
    this.#idImplK = idImplK;
    for (const [k, v] of entries) {
      this.#data[this.key(k)] = [k, v];
    }
  }

  key(k: K): string {
    return idKey(this.#idImplK(k));
  }

  [Symbol.iterator](): Iterator<[K, T]> {
    const self = this;
    return (function* () {
      for (const k in self.#data) {
        const val = self.#data[k];
        if (val) {
          yield val;
        }
      }
    })();
  }

  lookup(k: K): Opt<T> {
    const id = this.key(k);
    return Opt(this.#data[id]).map((entry) => entry[1]);
  }

  get src() {
    return this;
  }
  get changes() {
    return [];
  }

  mutate(mutater: (dm: DictMut_r<K, T>) => void): Dict_r<K, T> {
    return new MutatedDict(this, mutater);
  }
}

class IderClass<T> {
  #toId: (t: T) => IdLiteral;
  constructor(toId: (t: T) => IdLiteral) {
    this.#toId = toId;
  }

  Dict<V extends {}>(...entries: [T, V][]) {
    return new PureDict_r(this.#toId, entries);
  }
}

export type Ider<T extends {}> = IderClass<T>;
export function Ider<T extends {}>(f: (t: T) => IdLiteral): Ider<T> {
  return new IderClass(f);
}

const NumIder = Ider<number>((i) => i);

console.log("intDict!!!");
console.log(
  ...NumIder.Dict([1, 5], [2, 3]).mutate(($) => {
    $.set(1, 2);
    $.delete(2);
  }),
);
