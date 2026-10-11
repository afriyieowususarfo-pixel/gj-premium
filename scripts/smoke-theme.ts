/**
 * Functional smoke test for the header theme toggle.
 *
 *   bun scripts/smoke-theme.ts
 *
 * scripts/verify-static.ts proves the markup, links and classes are
 * sound; it cannot prove the shipped JavaScript behaves. This executes
 * the REAL dist/assets/site.js (read verbatim from dist, never imported
 * or re-implemented) inside a minimal DOM stub and asserts what a
 * browser would show: clicking flips the theme, the choice persists,
 * the accessible label and theme-color meta follow, the switch fade
 * arms and disarms, and the OS preference is tracked only until the
 * visitor makes an explicit choice.
 *
 * Run `bun run build:static` first — this reads ./dist.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE_JS = readFileSync(path.join(ROOT, "dist/assets/site.js"), "utf8");
const SITE_CSS = readFileSync(path.join(ROOT, "dist/assets/site.css"), "utf8");
const HOME_HTML = readFileSync(path.join(ROOT, "dist/index.html"), "utf8");

let failures = 0;
function check(name: string, cond: boolean, detail = ""): void {
  if (cond) {
    console.log(`  ok    ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

type ClassList = {
  contains: (c: string) => boolean;
  add: (c: string) => void;
  remove: (c: string) => void;
  toggle: (c: string, force?: boolean) => boolean;
};

function makeClassList(initial: string[] = []): ClassList {
  const set = new Set(initial);
  return {
    contains: (c) => set.has(c),
    add: (c) => void set.add(c),
    remove: (c) => void set.delete(c),
    toggle(c, force) {
      const want = force === undefined ? !set.has(c) : !!force;
      if (want) set.add(c);
      else set.delete(c);
      return want;
    },
  };
}

function makeStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
  };
}

type Button = {
  setAttribute: (k: string, v: string) => void;
  getAttribute: (k: string) => string | null;
  addEventListener: (t: string, fn: () => void) => void;
  click: () => void;
  attrs: Record<string, string>;
};

function makeButton(): Button {
  const attrs: Record<string, string> = {};
  const handlers: Record<string, (() => void)[]> = {};
  return {
    setAttribute: (k, v) => void (attrs[k] = String(v)),
    getAttribute: (k) => (k in attrs ? attrs[k] : null),
    addEventListener: (t, fn) => void ((handlers[t] ||= []).push(fn)),
    click() {
      (handlers.click || []).forEach((fn) => fn());
    },
    attrs,
  };
}

type Meta = {
  attrs: Record<string, string>;
  parentNode: { removeChild: (m: Meta) => void };
  setAttribute: (k: string, v: string) => void;
  getAttribute: (k: string) => string;
};

function makeEnv(
  options: {
    initialClasses?: string[];
    storageSeed?: Record<string, string>;
    osDark?: boolean;
  } = {},
) {
  const { initialClasses = [], storageSeed = {}, osDark = false } = options;

  const metas: Meta[] = [];
  const headOwner = {
    removeChild(m: Meta) {
      const i = metas.indexOf(m);
      if (i >= 0) metas.splice(i, 1);
    },
  };
  const seedMeta = (content: string): Meta => ({
    attrs: { name: "theme-color", content },
    parentNode: headOwner,
    setAttribute(k, v) {
      this.attrs[k] = String(v);
    },
    getAttribute(k) {
      return this.attrs[k];
    },
  });
  metas.push(seedMeta("#ffffff"), seedMeta("#131313"));

  const button = makeButton();
  const mediaHandlers: ((e: { matches: boolean }) => void)[] = [];
  const storage = makeStorage(storageSeed);
  const osState = { dark: osDark };

  const documentStub = {
    documentElement: {
      classList: makeClassList(initialClasses),
      style: { colorScheme: "" },
    },
    head: {
      appendChild(m: Meta) {
        metas.push(m);
      },
    },
    createElement: () => seedMeta(""),
    querySelectorAll(sel: string) {
      if (sel === "[data-theme-toggle]") return [button];
      if (sel === 'meta[name="theme-color"]') return metas.slice();
      return [];
    },
    querySelector: () => null,
  };

  const windowStub = {
    location: { pathname: "/", hash: "", search: "" },
    localStorage: storage,
    matchMedia: (query: string) => ({
      matches: query.includes("prefers-color-scheme") ? osState.dark : false,
      addEventListener(type: string, fn: (e: { matches: boolean }) => void) {
        if (type === "change") mediaHandlers.push(fn);
      },
      removeEventListener() {},
    }),
    addEventListener: () => {},
    setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
  };

  return {
    documentStub,
    windowStub,
    button,
    metas,
    storage,
    mediaHandlers,
    osState,
  };
}

function run(env: ReturnType<typeof makeEnv>): void {
  globalThis.window = env.windowStub as unknown as Window & typeof globalThis;
  globalThis.document =
    env.documentStub as unknown as Document & typeof globalThis;
  // Execute the shipped file verbatim.
  new Function(SITE_JS)();
}

const metaContent = (env: ReturnType<typeof makeEnv>): string[] =>
  env.metas.map((m) => m.attrs.content);

// ── Scenario A: light page, flip to dark and back ────────────────────
console.log("Scenario A: light page, click toggles and persists");
{
  const env = makeEnv();
  run(env);
  check(
    "initial label offers dark",
    env.button.attrs["aria-label"] === "Switch to dark theme",
    env.button.attrs["aria-label"],
  );
  check(
    "title matches label",
    env.button.attrs["title"] === env.button.attrs["aria-label"],
  );
  check(
    "static metas replaced by one",
    env.metas.length === 1 && metaContent(env)[0] === "#ffffff",
    JSON.stringify(metaContent(env)),
  );

  env.button.click();
  check(
    "click applies .dark",
    env.documentStub.documentElement.classList.contains("dark"),
  );
  check(
    "click persists theme=dark",
    env.storage.getItem("theme") === "dark",
    JSON.stringify(env.storage),
  );
  check(
    "label now offers light",
    env.button.attrs["aria-label"] === "Switch to light theme",
    env.button.attrs["aria-label"],
  );
  check(
    "theme-color pinned dark",
    env.metas.length === 1 && metaContent(env)[0] === "#131313",
    JSON.stringify(metaContent(env)),
  );
  check(
    "switch fade armed",
    env.documentStub.documentElement.classList.contains("theme-switching"),
  );
  check(
    "colorScheme flips too",
    env.documentStub.documentElement.style.colorScheme === "dark",
    env.documentStub.documentElement.style.colorScheme,
  );

  await new Promise((resolve) => setTimeout(resolve, 400));
  check(
    "switch fade disarmed after ~300ms",
    !env.documentStub.documentElement.classList.contains("theme-switching"),
  );

  env.button.click();
  check(
    "second click returns to light",
    !env.documentStub.documentElement.classList.contains("dark"),
  );
  check(
    "second click persists theme=light",
    env.storage.getItem("theme") === "light",
  );
  check(
    "label offers dark again",
    env.button.attrs["aria-label"] === "Switch to dark theme",
    env.button.attrs["aria-label"],
  );
  check("theme-color back to light", metaContent(env)[0] === "#ffffff");
}

// ── Scenario B: page loads already dark (stored) ─────────────────────
console.log("Scenario B: stored dark load flips to light");
{
  const env = makeEnv({
    initialClasses: ["dark"],
    storageSeed: { theme: "dark" },
  });
  run(env);
  check(
    "label offers light on dark load",
    env.button.attrs["aria-label"] === "Switch to light theme",
    env.button.attrs["aria-label"],
  );
  check("theme-color dark on load", metaContent(env)[0] === "#131313");
  env.button.click();
  check(
    "click removes .dark",
    !env.documentStub.documentElement.classList.contains("dark"),
  );
  check("click persists light", env.storage.getItem("theme") === "light");
}

// ── Scenario C: no choice yet → follows OS; choice locks it in ───────
console.log("Scenario C: OS tracking until an explicit choice");
{
  const env = makeEnv({ osDark: false });
  run(env);
  check("no stored theme initially", env.storage.getItem("theme") === null);
  check("OS change handler registered", env.mediaHandlers.length === 1);

  env.osState.dark = true;
  env.mediaHandlers[0]({ matches: true });
  check(
    "OS flip to dark applies",
    env.documentStub.documentElement.classList.contains("dark"),
  );
  check("OS flip persists nothing", env.storage.getItem("theme") === null);
  check("theme-color follows OS", metaContent(env)[0] === "#131313");

  env.button.click(); // explicit choice: dark → light, stores "light"
  check("choice persists light", env.storage.getItem("theme") === "light");
  env.mediaHandlers[0]({ matches: true }); // OS says dark again
  check(
    "OS ignored after explicit choice",
    !env.documentStub.documentElement.classList.contains("dark"),
  );
}

// ── Static assets: CSS guards and markup ─────────────────────────────
console.log("Static assets: CSS + markup");
check(
  "theme-switch fade rule present",
  SITE_CSS.includes("html.theme-switching"),
);
check(
  "fade disabled under reduced motion",
  /prefers-reduced-motion[\s\S]{0,400}theme-switching/.test(SITE_CSS),
);
check(
  "toggle hidden without JS",
  SITE_CSS.includes("html:not(.js) [data-theme-toggle]"),
);
check(
  "toggle in page markup exactly once",
  (HOME_HTML.match(/data-theme-toggle/g) || []).length === 1,
);
check("moon icon (dark:hidden) in markup", HOME_HTML.includes("dark:hidden"));
check("sun icon (dark:block) in markup", HOME_HTML.includes("dark:block"));
check(
  "bootstrap applies stored theme pre-paint",
  HOME_HTML.includes('localStorage.getItem("theme")'),
);

if (failures > 0) {
  console.log(`\n${failures} assertion(s) FAILED`);
  process.exit(1);
}
console.log("\nAll assertions passed.");
