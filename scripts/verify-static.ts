/**
 * Sanity checks for the generated static site (run after build-static).
 *
 *   bun scripts/verify-static.ts
 *
 * Verifies, for every HTML file in ./dist:
 *   1. every Tailwind class in the markup exists in the compiled stylesheet
 *      (catches typos and classes Tailwind never scanned);
 *   2. every internal link resolves to a real file, and every `#hash` target
 *      exists as an id on the destination page;
 *   3. tag nesting is balanced for the structural elements;
 *   4. nothing React/Vite-shaped leaked into the output.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");

/** Tailwind escapes every non [A-Za-z0-9_-] char in a class selector. */
function toSelector(className: string): string {
  return `.${className.replace(/[^A-Za-z0-9_-]/g, (char) => `\\${char}`)}`;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if ((await stat(full)).isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

/** Resolve a site-absolute href to a file inside dist. */
function resolveHref(href: string): { file: string; hash: string } | null {
  const [rawPath, ...hashParts] = href.split("#");
  const hash = hashParts.join("#");
  const pathname = rawPath.split("?")[0];
  if (pathname === "") return null;

  let file: string;
  if (pathname === "/") file = "index.html";
  else if (pathname.endsWith("/")) file = `${pathname.slice(1)}index.html`;
  else if (path.extname(pathname)) file = pathname.slice(1);
  else file = `${pathname.slice(1)}.html`;

  return { file, hash };
}

/** Files a site-absolute href could legitimately land on. */
function candidateFiles(href: string): string[] {
  const pathname = href.split("#")[0].split("?")[0];
  if (pathname === "/") return ["index.html"];
  const relative = pathname.slice(1);
  if (relative.endsWith("/")) return [`${relative}index.html`];
  if (path.extname(relative)) return [relative];
  return [`${relative}/index.html`, `${relative}.html`];
}

/**
 * True when the stylesheet contains `.escaped` as a complete class selector
 * (not merely as a prefix of a longer class such as `.p-64`).
 */
function cssHasClass(css: string, selector: string): boolean {
  let from = 0;
  for (;;) {
    const at = css.indexOf(selector, from);
    if (at === -1) return false;
    const next = css[at + selector.length];
    if (next === undefined || !/[A-Za-z0-9_-]/.test(next)) return true;
    from = at + selector.length;
  }
}

async function main(): Promise<void> {
  const problems: string[] = [];
  const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith(".html"));

  const css = await readFile(path.join(DIST, "assets/site.css"), "utf8");

  for (const file of htmlFiles) {
    const relative = path.relative(DIST, file);
    const html = await readFile(file, "utf8");

    // 1 — class coverage
    const classes = new Set(
      [...html.matchAll(/class="([^"]*)"/g)]
        .flatMap((match) => match[1].split(/\s+/))
        .filter(Boolean),
    );
    for (const className of classes) {
      if (className.startsWith("is-")) continue; // runtime-added state class
      if (!cssHasClass(css, toSelector(className))) {
        problems.push(`${relative}: class "${className}" is not in site.css`);
      }
    }

    // 3 — tag balance
    for (const tag of ["div", "section", "ul", "ol", "dl", "form", "main"]) {
      const open = (html.match(new RegExp(`<${tag}[\\s>]`, "g")) ?? []).length;
      const close = (html.match(new RegExp(`</${tag}>`, "g")) ?? []).length;
      if (open !== close) {
        problems.push(
          `${relative}: <${tag}> unbalanced (${open} open, ${close} close)`,
        );
      }
    }

    // 4 — no framework leftovers
    for (const banned of ["/src/main.tsx", "react-dom", "data-slot="]) {
      if (html.includes(banned)) {
        problems.push(`${relative}: contains "${banned}"`);
      }
    }

    // 2 — links
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
    );
    const links = [...html.matchAll(/href="([^"]+)"/g)].map(
      (match) => match[1],
    );
    for (const href of links) {
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      if (href.startsWith("#")) {
        if (!ids.has(href.slice(1))) {
          problems.push(`${relative}: anchor "${href}" has no target on page`);
        }
        continue;
      }

      const resolved = resolveHref(href);
      if (!resolved) continue;

      let target: string | null = null;
      let matchedFile: string | null = null;
      for (const candidate of candidateFiles(href)) {
        try {
          target = await readFile(path.join(DIST, candidate), "utf8");
          matchedFile = candidate;
          break;
        } catch {
          /* try the next candidate */
        }
      }
      if (target === null || matchedFile === null) {
        problems.push(`${relative}: link "${href}" does not resolve to a file`);
        continue;
      }
      if (resolved.hash) {
        const targetIds = new Set(
          [...target.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
        );
        if (!targetIds.has(resolved.hash)) {
          problems.push(
            `${relative}: link "${href}" -> ${matchedFile} has no id "${resolved.hash}"`,
          );
        }
      }
    }
  }

  if (problems.length > 0) {
    console.error(`\n  ${problems.length} problem(s):\n`);
    for (const problem of problems.slice(0, 60)) console.error(`  - ${problem}`);
    if (problems.length > 60) {
      console.error(`  … and ${problems.length - 60} more`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(
    `\n  ${htmlFiles.length} HTML pages verified: classes, links, anchors, nesting.\n`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
