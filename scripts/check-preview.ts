/**
 * One-off check: the dev server must serve the generated static pages as
 * plain HTML. Three things are asserted:
 *
 *  1. htmlFallbackMiddleware resolves `/`, `/products/`, `/quote/`, … to
 *     `path.join(root, pathname, "index.html")` — those files must exist.
 *  2. transformIndexHtml (devHtmlHook) leaves the static markup alone: the
 *     stylesheet link and the site script survive untouched, the JSON-LD
 *     blocks stay intact, and only Vite's own HMR client is injected.
 *  3. The real middleware stack, driven with mock req/res objects (no port
 *     is ever bound), answers each route with the right file, status and
 *     content type — including /assets/site.css out of ./public.
 *
 * The server is created in middleware mode and never listens, so no port
 * is opened; it is closed before the process exits.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { createServer } from "vite";

const ROOT = process.cwd();

const ROUTES = ["/", "/products/", "/quote/", "/thank-you/", "/privacy/"];
const PAGES = [
  "index.html",
  "products/index.html",
  "quote/index.html",
  "thank-you/index.html",
  "privacy/index.html",
  "404.html",
];

let failures = 0;
const check = (name: string, ok: boolean, detail = ""): void => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${name}${ok ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
};

console.log("1 — Vite html fallback resolves every route to a real file");
for (const route of ROUTES) {
  const target = path.join(ROOT, route, "index.html");
  check(`${route} → ${path.relative(ROOT, target)}`, existsSync(target));
}
check("/404.html", existsSync(path.join(ROOT, "404.html")));

console.log("\n2 — transformIndexHtml leaves the static markup intact");
const server = await createServer({
  configFile: false,
  root: ROOT,
  logLevel: "error",
  // Mirror vite.config.ts: only index.html is scanned for deps, so the
  // scanner doesn't walk every HTML file in the tree.
  optimizeDeps: { entries: ["index.html"] },
  server: { middlewareMode: true, hmr: false },
  appType: "spa",
});

try {
  for (const file of PAGES) {
    const source = readFileSync(path.join(ROOT, file), "utf8");
    const url = `/${file}`;
    const html = await server.transformIndexHtml(url, source);

    const ld = (text: string): number =>
      (text.match(/application\/ld\+json/g) ?? []).length;

    check(
      `${file}: site.js tag untouched`,
      html.includes('<script src="/assets/site.js" defer></script>'),
    );
    check(
      `${file}: stylesheet link untouched`,
      html.includes('<link rel="stylesheet" href="/assets/site.css" />'),
    );
    check(`${file}: HMR client injected`, html.includes("/@vite/client"));
    // index/products/quote/privacy ship structured data; thank-you and 404
    // intentionally ship none. Whatever the page had must survive intact.
    check(
      `${file}: JSON-LD preserved (${ld(source)})`,
      ld(html) === ld(source),
      `${ld(source)} → ${ld(html)}`,
    );
    check(
      `${file}: no React entry`,
      !html.includes("src/main.tsx") && !html.includes('id="root"'),
    );
  }

  console.log("\n3 — the middleware stack answers each route like a static host");

type Reply = { status: number; body: string; type: string };
/** Drive one request through Vite's connect stack without binding a port. */
function request(url: string): Promise<Reply> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = {
      accept: "text/html,application/xhtml+xml,*/*;q=0.8",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      host: "localhost",
    };
    const chunks: Buffer[] = [];
    let done = false;

    const finish = (error: Error | null, reply?: Reply): void => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(reply!);
    };

    const timer = setTimeout(
      () => finish(new Error(`${url}: no response within 10s`)),
      10_000,
    );

    const req = {
      method: "GET",
      url,
      headers,
      originalUrl: url,
      pause: () => req,
      resume: () => req,
      on: () => req,
      removeListener: () => req,
      socket: { encrypted: false },
    } as unknown as import("node:http").IncomingMessage;

    const res = {
      statusCode: 200,
      headersSent: false,
      writableEnded: false,
      finished: false,
      headers: {} as Record<string, string>,
      setHeader(name: string, value: unknown) {
        this.headers[name.toLowerCase()] = String(value);
      },
      getHeader(name: string) {
        return this.headers[name.toLowerCase()];
      },
      removeHeader(name: string) {
        delete this.headers[name.toLowerCase()];
      },
      appendHeader(name: string, value: string | number | string[]) {
        const key = name.toLowerCase();
        const next = String(value);
        this.headers[key] = this.headers[key]
          ? `${this.headers[key]}, ${next}`
          : next;
        return this;
      },
      writeHead(
        code: number,
        headers?: Record<string, string | number | string[]>,
      ) {
        this.statusCode = code;
        if (headers) {
          for (const [name, value] of Object.entries(headers)) {
            this.setHeader(name, value);
          }
        }
        return this;
      },
      write(chunk: string | Uint8Array) {
        chunks.push(Buffer.from(chunk));
        return true;
      },
      end(chunk?: string | Uint8Array) {
        if (chunk) chunks.push(Buffer.from(chunk));
        this.writableEnded = true;
        this.headersSent = true;
        this.finished = true;
        finish(null, {
          status: this.statusCode,
          body: Buffer.concat(chunks).toString("utf8"),
          type: this.headers["content-type"] ?? "",
        });
      },
      on: () => res,
      once: () => res,
      emit: () => false,
      destroy: () => res,
    } as unknown as import("node:http").ServerResponse;

    server.middlewares(req, res, (error?: unknown) => {
      if (error) finish(error instanceof Error ? error : new Error(String(error)));
      else finish(new Error(`${url}: fell through every middleware`));
    });
  });
}

const ROUTES_SERVED: {
  url: string;
  status: number;
  type: string;
  contains?: string;
}[] = [
  { url: "/", status: 200, type: "text/html", contains: "Medical supplies" },
  {
    url: "/products/",
    status: 200,
    type: "text/html",
    contains: "Product lines we stock",
  },
  { url: "/quote/", status: 200, type: "text/html", contains: "data-quote-form" },
  {
    url: "/thank-you/",
    status: 200,
    type: "text/html",
    contains: "assets/site.js",
  },
  {
    url: "/privacy/",
    status: 200,
    type: "text/html",
    contains: "assets/site.css",
  },
  {
    url: "/assets/site.css",
    status: 200,
    type: "text/css",
    contains: "theme-switching",
  },
  {
    url: "/assets/site.js",
    status: 200,
    type: "javascript",
    contains: "FORM_ENDPOINT",
  },
];

for (const expected of ROUTES_SERVED) {
  try {
    const reply = await request(expected.url);
    const problems: string[] = [];
    if (reply.status !== expected.status) {
      problems.push(`status ${reply.status} ≠ ${expected.status}`);
    }
    if (!reply.type.includes(expected.type)) {
      problems.push(`content-type "${reply.type}" lacks "${expected.type}"`);
    }
    if (expected.contains && !reply.body.includes(expected.contains)) {
      problems.push(`body lacks "${expected.contains}"`);
    }
    check(`${expected.url} → ${reply.status} ${reply.type}`, problems.length === 0, problems.join(", "));
  } catch (error) {
    check(expected.url, false, error instanceof Error ? error.message : String(error));
  }
}
  } finally {
  // Let the background dependency scan finish before shutting down,
  // otherwise it reports a spurious "server is closed" error.
  await new Promise((resolve) => setTimeout(resolve, 500));
  await server.close();
}

console.log(
  failures > 0 ? `\n${failures} check(s) FAILED` : "\nPreview checks passed.",
);
process.exit(failures > 0 ? 1 : 0);
