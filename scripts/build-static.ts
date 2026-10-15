/**
 * Builds the static site.
 *
 *   bun scripts/build-static.ts
 *
 * Emits a self-contained site — plain HTML files, one stylesheet, one script,
 * plus the images/robots/sitemap from ./public. No React, no Convex, no
 * runtime: any static file host (or the Deno server in main.ts) can serve
 * ./dist as-is.
 *
 * Every page is written twice, to two roots:
 *
 *   dist/…       what gets deployed
 *   ./…          what the dev server resolves requests against, so the
 *                preview *is* this static site: Vite maps / to index.html,
 *                /products/ to products/index.html, and so on.
 *
 *   index.html            landing page
 *   products/index.html   the ten categories
 *   quote/index.html      the quote form
 *   thank-you/index.html  post-submit confirmation
 *   privacy/index.html    privacy policy
 *   404.html              not-found page
 *
 * The stylesheet is compiled into ./public/assets/site.css first: ./public
 * is copied verbatim into dist and is also the one directory the dev server
 * serves from, so both serve byte-identical CSS.
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

/* Theme flip: a short colour fade, applied only for the ~300ms the
   switch runs so ordinary hover transitions stay instant elsewhere.
   Skipped under prefers-reduced-motion. */
html.theme-switching,
html.theme-switching * {
  transition:
    background-color 260ms ease, border-color 260ms ease, color 260ms ease,
    box-shadow 260ms ease, fill 260ms ease !important;
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
  html.theme-switching,
  html.theme-switching * {
    transition: none !important;
  }
}

/* The theme toggle is script-driven: without JavaScript it would do
   nothing, so it stays hidden. The page itself still follows the OS
   colour scheme via the inline head bootstrap either way. */
html:not(.js) [data-theme-toggle] {
  display: none;
}
`;

/** Output path for each page, relative to an output root (dist or project). */
const OUTPUTS: { page: PageInput; file: string }[] = [
  // `file` is relative — written under DIST (deploy) and under ROOT (preview).
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
    [
      "@tailwindcss/cli",
      "-i",
      "src/index.css",
      "-o",
      "public/assets/site.css",
    ],
    { cwd: ROOT, stdio: "inherit" },
  );
  if (result.status !== 0) {
    fail(`Tailwind exited with status ${String(result.status)}`);
  }
}

async function main(): Promise<void> {
  setAssortment(PRODUCT_CATEGORIES);

  // 1) Stylesheet first: Tailwind writes it into ./public/assets, then the
  //    behaviours the old React runtime owned (reveal, select placeholders,
  //    theme fade) are appended. ./public is copied into dist verbatim and
  //    is the only directory the dev server serves static files from, so
  //    one file here is the single source of truth for both.
  buildStylesheet();
  const stylesheet = path.join(PUBLIC, "assets/site.css");
  const css = await readFile(stylesheet, "utf8");
  await writeFile(stylesheet, `${css.trimEnd()}\n${ENHANCEMENTS}`, "utf8");

  // 2) A fresh ./dist, then every static asset from ./public.
  await rm(DIST, { recursive: true, force: true });
  await mkdir(path.join(DIST, "assets"), { recursive: true });
  await cp(PUBLIC, DIST, { recursive: true });

  // 3) The pages: rendered once, written to dist (deployment) and to the
  //    project root (the dev server's document root).
  for (const { page, file } of OUTPUTS) {
    const html = renderPage(page);
    for (const dir of [DIST, ROOT]) {
      const target = path.join(dir, file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, html, "utf8");
    }
    console.log(`  ${file}  →  dist/${file}`);
  }

  console.log("  assets/site.css  →  dist/assets/site.css (+ enhancements)");
  console.log("  assets/site.js   →  dist/assets/site.js");
  console.log("\nStatic site built.\n");
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.stack ?? error.message : String(error));
});
