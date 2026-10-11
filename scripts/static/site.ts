/**
 * Document layout + shared chrome for the static site.
 *
 * Every page is emitted as a complete, self-contained HTML file: real head
 * tags (title, description, canonical, Open Graph, JSON-LD) instead of the
 * runtime `usePageSeo()` hook, and a real header/footer instead of React
 * components.
 */

import {
  BTN_PRIMARY_SM,
  iconArrowRight,
  iconMoon,
  iconSun,
} from "./ui.ts";

export const SITE_NAME = "GJ Premium";
export const SITE_URL = "https://gjpremium.com";
export const DEFAULT_IMAGE = "/pills-heart.jpg";
export const CONTACT_EMAIL = "gjpremium14@gmail.com";
export const CONTACT_PHONE = "+447485206665";
export const CONTACT_PHONE_LABEL = "+44 7485 206665";
export const HOURS_LABEL = "Mon–Fri, 8:00–18:00 ET";

export const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

/** Escape text for interpolation into HTML. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Serialize a JSON-LD object safely inside a <script> element. */
export function jsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Breadcrumb structured data, always starting at Home. */
export function breadcrumbJsonLd(
  items: { name: string; path?: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  };
}

// ── Chrome ────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Overview", to: "/", hash: "#overview" },
  { label: "Products", to: "/products/", hash: "" },
  { label: "Process", to: "/#process", hash: "#process" },
];

function wordmark(large: boolean): string {
  return `<span class="whitespace-nowrap font-bold tracking-tight leading-none ${
    large ? "text-2xl" : "text-lg"
  }"><span class="text-brand-navy">GJ</span> <span class="font-semibold text-brand-teal">Premium</span></span>`;
}

export function siteHeader(): string {
  const nav = NAV_LINKS.map((link) => {
    const href = link.hash ? `/${link.hash}` : link.to;
    const attrs = link.hash
      ? `data-nav data-to="/" data-hash="${link.hash}"`
      : `data-nav data-to="${link.to}"`;
    return `<a href="${href}" ${attrs} class="text-sm text-muted-foreground transition-colors hover:text-foreground">${link.label}</a>`;
  }).join("\n              ");

  return `<header class="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
          <a href="/" aria-label="GJ Premium home" class="transition-opacity hover:opacity-80">${wordmark(false)}</a>

          <nav class="hidden items-center gap-8 md:flex">
              ${nav}
          </nav>

          <div class="flex items-center gap-2.5">
            ${themeToggle()}
            <a href="/quote/" class="${BTN_PRIMARY_SM}">Request a quote${iconArrowRight("size-3.5")}</a>
          </div>
        </div>
      </header>`;
}

/**
 * Light/dark switch for the header. The icon swap is pure CSS (moon in
 * light mode, sun in dark), so the correct icon shows before any script
 * runs; site.js flips the `.dark` class, persists the choice to
 * localStorage["theme"], and keeps the accessible label in step. Hidden
 * when scripting is unavailable — see the `html:not(.js)` rule in the
 * build's enhancements CSS — because a button that does nothing is worse
 * than no button.
 */
export function themeToggle(): string {
  return `<button type="button" data-theme-toggle aria-label="Switch color theme" title="Switch color theme" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none">
              ${iconMoon("size-4 dark:hidden")}
              ${iconSun("hidden size-4 dark:block")}
            </button>`;
}

/** Sticky phone-only call to action. Omitted on the quote form itself. */
export function mobileCtaBar(): string {
  return `<div class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Reply within one business day</p>
          <p class="truncate text-sm font-medium">Tell us what you need</p>
        </div>
        <a href="/quote/" class="${BTN_PRIMARY_SM} shrink-0">Request a quote${iconArrowRight("size-3.5")}</a>
      </div>
    </div>`;
}

function footerColumn(heading: string, links: string): string {
  return `<div>
            <h3 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">${heading}</h3>
            <ul class="mt-4 space-y-2.5">${links}</ul>
          </div>`;
}

function footerLink(label: string, href: string): string {
  return `<li><a href="${href}" class="text-sm text-muted-foreground transition-colors hover:text-foreground">${esc(label)}</a></li>`;
}

export function siteFooter(assortment: { slug: string; name: string }[]): string {
  const siteLinks = [
    ["Overview", "/#overview"],
    ["Products", "/products/"],
    ["FAQ", "/#faq"],
    ["Case studies", "/#cases"],
    ["Quote process", "/#process"],
  ]
    .map(([label, href]) => footerLink(label, href))
    .join("");

  const quoteLinks = [
    ["Request a quote", "/quote/"],
    ["What to include", "/quote/#checklist"],
  ]
    .map(([label, href]) => footerLink(label, href))
    .join("");

  const contactLinks = [
    `<li><a href="mailto:${CONTACT_EMAIL}" class="text-sm text-muted-foreground transition-colors hover:text-foreground">${CONTACT_EMAIL}</a></li>`,
    `<li><a href="tel:${CONTACT_PHONE}" class="text-sm text-muted-foreground transition-colors hover:text-foreground">${CONTACT_PHONE_LABEL}</a></li>`,
    `<li><span class="text-sm text-muted-foreground">${HOURS_LABEL}</span></li>`,
  ].join("");

  const assortmentLinks = assortment
    .map((category) => footerLink(category.name, `/products/#${category.slug}`))
    .join("");

  return `<footer class="border-t border-border">
      <div class="mx-auto w-full max-w-6xl px-6 pt-14 pb-28 md:pb-14 lg:px-8">
        <div class="grid gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            ${wordmark(true)}
            <p class="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">Medical supply partner to clinics, practices, labs, and care facilities. Quality products, careful fulfillment, one clear quote.</p>
          </div>

          <div class="grid gap-10 md:col-span-6 md:col-start-7 md:grid-cols-2 lg:grid-cols-3">
            ${footerColumn("Site", siteLinks)}
            ${footerColumn("Quotes", quoteLinks)}
            ${footerColumn("Contact", contactLinks)}
          </div>
        </div>

        <div class="mt-12 border-t border-border pt-7">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Assortment</h3>
          <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">${assortmentLinks}</ul>
        </div>

        <div class="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-5 text-xs text-muted-foreground">
            <span>&copy; ${new Date().getFullYear()} GJ Premium. All rights reserved.</span>
            <a href="/privacy/" class="transition-colors hover:text-foreground">Privacy policy</a>
          </div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Quality &middot; Care &middot; Supply</p>
        </div>
      </div>
    </footer>`;
}

/** Hairline breadcrumb trail: Home → … → current page. */
export function breadcrumbs(items: { label: string }[]): string {
  const trail = items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      return `<li class="flex items-center gap-2.5"${isLast ? ' aria-current="page"' : ""}><span class="${
        isLast ? "text-foreground" : ""
      }">${esc(item.label)}</span>${isLast ? "" : '<span aria-hidden>/</span>'}</li>`;
    })
    .join("");

  return `<nav aria-label="Breadcrumb" class="__CRUMB_CLASS__">
      <ol class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
        <li class="flex items-center gap-2.5"><a href="/" class="transition-colors hover:text-foreground">Home</a><span aria-hidden>/</span></li>
        ${trail}
      </ol>
    </nav>`;
}

/** Breadcrumbs with an explicit wrapper class (e.g. `mb-7`). */
export function pageBreadcrumbs(items: { label: string }[], className: string) {
  return breadcrumbs(items).replace("__CRUMB_CLASS__", className);
}

// ── Document ──────────────────────────────────────────────────────────

export type PageInput = {
  title: string;
  description: string;
  /** Canonical path, e.g. "/" or "/products". */
  path: string;
  content: string;
  noindex?: boolean;
  jsonLd?: object[];
  /** Suppress the sticky mobile CTA (the quote form has its own submit). */
  hideMobileCta?: boolean;
  /** Skip the site header/footer for bare utility pages. */
  bare?: boolean;
};

const THEME_BOOTSTRAP = `
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        var dark =
          stored === "dark" ||
          ((stored === null || stored === "system") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        if (dark) document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = dark ? "dark" : "light";
        document.documentElement.classList.add("js");
      } catch (e) {
        document.documentElement.classList.add("js");
      }
    })();`;

export function renderPage({
  title,
  description,
  path,
  content,
  noindex = false,
  jsonLd: jsonLdObjects = [],
  hideMobileCta = false,
  bare = false,
}: PageInput): string {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  const shareImage = `${SITE_URL}${DEFAULT_IMAGE}`;

  const ldScripts = jsonLdObjects
    .map(
      (object) =>
        `  <script type="application/ld+json">${jsonLd(object)}</script>`,
    )
    .join("\n");

  const chrome = bare
    ? content
    : `${siteHeader()}\n\n      <main>\n${content}\n      </main>\n\n      ${siteFooter(
        ASSORTMENT,
      )}`;

  const cta = hideMobileCta || bare ? "" : `\n  ${mobileCtaBar()}`;

  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/logo.svg" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#131313" media="(prefers-color-scheme: dark)" />
  <script>${THEME_BOOTSTRAP}
  </script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${shareImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${shareImage}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/assets/site.css" />
${ldScripts}
</head>

<body>
  <div class="min-h-screen bg-background">
      ${chrome}${cta}
  </div>
  <script src="/assets/site.js" defer></script>
</body>

</html>
`;
}

/** Filled in by the build once the catalog is imported. */
let ASSORTMENT: { slug: string; name: string }[] = [];

export function setAssortment(
  categories: { slug: string; name: string }[],
): void {
  ASSORTMENT = categories;
}
