import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

// Least-privilege browser surface for the production build. These headers
// only apply when this Deno server serves ./dist (the Vite dev preview does
// not run this file, so local development is unaffected).
//
// The site is plain static HTML: it calls no API of its own, so CSP only
// grants what the pages actually load:
//  - scripts: /assets/site.js plus the inline theme bootstrap in <head>
//  - style/fonts: Google Fonts, which every page preconnects to
//  - connect: nothing beyond 'self' (no backend, no analytics)
//  - form-action: 'self' for a normal POST, plus mailto: for the quote
//    form's no-JavaScript fallback — with JS on, site.js opens the mail
//    client itself, which form-action does not govern.
// Everything else defaults to 'self'; framing and plugins are denied.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
].join("; ");

app.use("*", async (c, next) => {
  await next();
  c.res.headers.set("Content-Security-Policy", CSP);
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // The site uses no camera/mic/geolocation/payment; deny them outright.
  c.res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  c.res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains",
  );
});

// 1) Serve anything in /assets/**
app.use("/assets/*", serveStatic({ root: "./dist/assets" }));

// 2) Everything else in dist (HTML pages, robots, sitemap, images, …).
//    hono's serveStatic resolves a directory URL to its index.html, so
//    /products/ lands on dist/products/index.html.
app.use("*", serveStatic({ root: "./dist" }));

// 3) Unknown paths answer with the real 404 page and a 404 status. The site
//    is multi-page now: there is no client router left to fall back to, and
//    serving index.html for every URL would tell search engines that every
//    path exists.
app.get(
  "*",
  serveStatic({
    path: "./dist/404.html",
    onFound: (_path, c) => c.status(404),
  }),
);

Deno.serve(app.fetch);
