/**
 * Google Analytics 4, loaded only when a measurement id is configured.
 *
 * Add `VITE_GA_ID` (value starting with `G-`) in the project's Keys tab and
 * the tag loads on every page; without it nothing is injected and no network
 * request is made, so the site works exactly as before.
 */
const MEASUREMENT_ID = import.meta.env.VITE_GA_ID as string | undefined;

type GaWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function isAnalyticsEnabled(): boolean {
  return Boolean(MEASUREMENT_ID);
}

function gtag(...args: unknown[]) {
  const w = window as GaWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(args);
}

let started = false;

/** Inject the GA tag once, without an initial automatic page view. */
export function initAnalytics() {
  if (!MEASUREMENT_ID || typeof document === "undefined" || started) return;
  started = true;

  const w = window as GaWindow;
  w.gtag = gtag;

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { send_page_view: false });

  if (document.querySelector(`script[data-ga-id="${MEASUREMENT_ID}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.setAttribute("data-ga-id", MEASUREMENT_ID);
  document.head.appendChild(script);
}

/** Record an SPA route change as a page view (client-side routing). */
export function trackPageView(path: string) {
  const w = window as GaWindow;
  if (!MEASUREMENT_ID || !w.gtag) return;
  w.gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
}
