import { useEffect } from "react";

export const SITE_NAME = "GJ Premium";

/**
 * Origin used for canonical URLs, Open Graph tags and JSON-LD.
 * Defaults to the company domain; set `VITE_SITE_URL` in the Keys tab to
 * point everything at a different (e.g. custom) domain without code changes.
 */
const envUrl = import.meta.env.VITE_SITE_URL as string | undefined;
export const SITE_URL = (envUrl || "https://gjpremium.com").replace(/\/+$/, "");

export const DEFAULT_IMAGE = "/pills-heart.jpg";

/** Absolute URL for a site path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type SeoInput = {
  /** Full document title for this page. */
  title: string;
  /** Meta description (and og/twitter description). */
  description: string;
  /** Canonical path, e.g. "/products". */
  path: string;
  /** Social share image path (defaults to the brand photo). */
  image?: string;
  /** Set for pages that should not be indexed (auth, 404, session pages). */
  noindex?: boolean;
  /** JSON-LD objects to publish on this page. */
  jsonLd?: object[];
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Breadcrumb structured data for a trail (always starts at Home). */
export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

const SEO_LD_ATTR = "data-seo-ld";

function publishJsonLd(objects: object[]) {
  document.head
    .querySelectorAll(`script[${SEO_LD_ATTR}]`)
    .forEach((node) => node.remove());
  if (objects.length === 0) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute(SEO_LD_ATTR, "true");
  script.textContent = JSON.stringify(objects);
  document.head.appendChild(script);
}

/**
 * Writes the page's tags into `document.head`. Exposed separately from the
 * hook so the behaviour can be verified without a browser.
 */
export function applyPageSeo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd = [],
}: SeoInput): void {
  const canonical = absoluteUrl(path);
  const shareImage = absoluteUrl(image);

  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", SITE_NAME);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:image", shareImage);

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", shareImage);

  setCanonical(canonical);
  publishJsonLd(jsonLd);
}

/**
 * Publishes the page's document title, meta description, canonical link,
 * Open Graph / Twitter share tags and JSON-LD. Runs in an effect so it only
 * touches the browser, so SSR renders are unaffected.
 */
export function usePageSeo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd = [],
}: SeoInput) {
  // Serialized so callers can pass inline arrays without re-running every render.
  const jsonLdKey = JSON.stringify(jsonLd);

  useEffect(() => {
    applyPageSeo({
      title,
      description,
      path,
      image,
      noindex,
      // Parsed from the serialized key so the effect doesn't depend on object
      // identity (callers pass inline arrays).
      jsonLd: JSON.parse(jsonLdKey) as object[],
    });
  }, [title, description, path, image, noindex, jsonLdKey]);
}
