/**
 * Builds the static site.
 *
 *   bun scripts/build-static.ts
 *
 * Emits a self-contained site into ./dist — plain HTML files, one stylesheet,
 * one script, plus the images/robots/sitemap from ./public. No React, no
 * Convex, no runtime: any static file host (or the Deno server in main.ts)
 * can serve it as-is.
 *
 *   dist/index.html            landing page
 *   dist/products/index.html   the ten categories
 *   dist/quote/index.html      the quote form
 *   dist/thank-you/index.html  post-submit confirmation
 *   dist/privacy/index.html    privacy policy
 *   dist/404.html              not-found page
 */

import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { setAssortment } from "./static/site.ts";
import { renderPage, type PageInput } from "./static/site.ts";
import { homePage } from "./static/pages/home.ts";
import { productsPage } from "./static/pages/products.ts";
import { quotePage } from "./static/pages/quote.ts";
import { privacyPage } from "./static/pages/privacy.ts";
import { notFoundPage, thankYouPage } from "./static/pages/misc.ts";
import { PRODUCT_CATEGORIES } from "../src/lib/catalog.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const PUBLIC = path.join(ROOT, "public");

/**
 * Extra CSS layered on top of the Tailwind build: the two behaviours the old
 * React runtime implemented in JS (section reveal, select placeholders) and
 * smooth in-page anchors.
 */
const ENHANCEMENTS = `
/* ── Static-site enhancements ─────────────────────────────────── */

/* Native <select> placeholders read like the select they replaced. */
select[data-empty="true"] {
  color: var(--muted-foreground);
}

/* Scroll reveal, replacing the old framer-motion whileInView. Scoped to
   .js so the page stays fully visible when JavaScript is unavailable. */
.js .reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 550ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0s),
    transform 550ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0s);
}
.js .reveal.is-visible {
  opacity: 1;
  transform: none;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .js .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
`;

/** Output path for each page, relative to dist. */
const OUTPUTS: { page: PageInput; file: string }[] = [
  { page: homePage(), file: "index.html" },
  { page: productsPage(), file: "products/index.html" },
  { page: quotePage(), file: "quote/index.html" },
  { page: thankYouPage(), file: "thank-you/index.html" },
  { page: privacyPage(), file: "privacy/index.html" },
  { page: notFoundPage(), file: "404.html" },
];

function fail(message: string): never {
  console.error(`\n  build-static: ${message}\n`);
  process.exit(1);
}

/** Compile Tailwind over the generator sources and the app stylesheet. */
function buildStylesheet(): void {
  const result = spawnSync(
    "bunx",
    ["@tailwindcss/cli", "-i", "src/index.css", "-o", "dist/assets/site.css"],
    { cwd: ROOT, stdio: "inherit" },
  );
  if (result.status !== 0) {
    fail(`Tailwind exited with status ${String(result.status)}`);
  }
}

async function main(): Promise<void> {
  setAssortment(PRODUCT_CATEGORIES);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(path.join(DIST, "assets"), { recursive: true });

  // Static assets (images, robots, sitemap, llms.txt, the site script).
  await cp(PUBLIC, DIST, { recursive: true });

  for (const { page, file } of OUTPUTS) {
    const target = path.join(DIST, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, renderPage(page), "utf8");
    console.log(`  dist/${file}`);
  }

  buildStylesheet();

  const css = await readFile(path.join(DIST, "assets/site.css"), "utf8");
  await writeFile(
    path.join(DIST, "assets/site.css"),
    `${css.trimEnd()}\n${ENHANCEMENTS}`,
    "utf8",
  );
  console.log("  dist/assets/site.css (+ enhancements)");
  console.log("  dist/assets/site.js");
  console.log("\nStatic site built.\n");
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.stack ?? error.message : String(error));
});
