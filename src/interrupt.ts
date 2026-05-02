let nextInterruptId = 1;

let intervalId: null | {} = null;

class UtilClass {
  #manager: InterruptManager;

  constructor(manager: InterruptManager) {
    this.#manager = manager;
  }

  addYt<T>(f: () => T): T | null {
    return this.#manager.addYt(f);
  }
}

const handlers: Record<number, (util: InterruptUtil) => Promise<void>> = {};

class InterruptManager {
  #lastYtAdd: number | null = null;

  constructor() {}

  get canAddYt() {
    const now = Date.now();
    return !this.#lastYtAdd || now - 4500 > this.#lastYtAdd;
  }

  addYt<T>(f: () => T): T | null {
    if (!this.canAddYt) {
      return null;
    }
    this.#lastYtAdd = Date.now();
    return f();
  }

  reset() {}
}

async function interruptHandler(manager: InterruptManager) {
  manager.reset();
  const util = new UtilClass(manager);
  await Promise.all(Object.values(handlers).map((f) => f(util)));
}

function ensureIntervalOn() {
  if (intervalId !== null) {
    return;
  }
  const manager = new InterruptManager();
  intervalId = setInterval(() => interruptHandler(manager), 1000);
}

export function onInterrupt(f: (util: UtilClass) => Promise<void>): () => void {
  const interruptId = nextInterruptId++;
  handlers[interruptId] = f;
  ensureIntervalOn();
  return () => {
    delete handlers[interruptId];
  };
}

export type InterruptUtil = UtilClass;
