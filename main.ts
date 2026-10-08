import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

// Least-privilege browser surface for the production build. These headers
// only apply when this Deno server serves ./dist (the Vite dev preview does
// not run this file, so local development is unaffected).
//
// CSP grants each resource type only the origins the app actually uses:
//  - scripts: the bundle itself, the inline theme bootstrap in index.html,
//    and Google Analytics (loaded only when VITE_GA_ID is configured).
//  - connect: this deployment's Convex backend (wildcard convex.cloud covers
//    the project URL and its websocket) plus GA beacons.
//  - fonts: Google Fonts, which index.html preconnects to.
// Everything else defaults to 'self'; framing and plugins are denied.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com",
  "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.google-analytics.com https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
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

// 2) Catch *all* other files in dist (CSS, JS, images, etc.)
app.use("*", serveStatic({ root: "./dist" }));

// 3) Fallback to index.html for the SPA
app.get("*", serveStatic({ path: "./dist/index.html" }));

Deno.serve(app.fetch);
