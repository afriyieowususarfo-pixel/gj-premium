/**
 * Tailwind class strings copied verbatim from the app's shadcn/ui primitives
 * (already resolved through `tailwind-merge`, exactly as the React tree used
 * to render them). Keeping them here means the static site has zero React
 * dependency while still looking identical.
 */

/** `buttonVariants({ variant: "default" })` + `size: "lg"`. */
export const BTN_PRIMARY_LG =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-full px-7 has-[>svg]:px-4 text-[15px]";

/** The white pill used on the dark closing CTA. */
export const BTN_LIGHT_LG =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 rounded-full px-7 has-[>svg]:px-4 text-[15px] bg-white text-neutral-950 hover:bg-neutral-200";

/** `buttonVariants({ variant: "default" })` + `size: "sm"`. */
export const BTN_PRIMARY_SM =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-full px-4 has-[>svg]:px-2.5 text-[13px]";

/** `Input` with the quote page's `h-10` override. */
export const INPUT_CLS =
  "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

/** `Textarea` with the quote page's `min-h-32` override. */
export const TEXTAREA_CLS =
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

/**
 * A native `<select>` dressed to match the Radix `SelectTrigger` (the
 * dropdown itself stays the browser's own, so it works with no JavaScript
 * framework).
 */
export const SELECT_CLS =
  "border-input data-[empty=true]:text-muted-foreground flex h-10 w-full appearance-none rounded-md border bg-transparent px-3 py-1 pr-9 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm dark:bg-input/30";

/** `Label` as composed by the quote form's `Field`. */
export const LABEL_CLS =
  "mb-2 block items-center gap-2 text-sm leading-none font-medium select-none";

/** `Field`'s error paragraph. */
export const ERROR_CLS = "mt-1.5 text-xs text-destructive";

// ── Lucide icons (inlined) ────────────────────────────────────────────

const SVG_BASE =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

export function iconArrowRight(cls = "size-4"): string {
  return `<svg class="${cls}" ${SVG_BASE}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
}

export function iconCheck(cls = "size-4", strokeWidth = 2.5): string {
  return `<svg class="${cls}" ${SVG_BASE} stroke-width="${strokeWidth}"><path d="M20 6 9 17l-5-5"/></svg>`;
}

export function iconLoader(cls = "size-4"): string {
  return `<svg class="${cls}" ${SVG_BASE}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;
}

export function iconChevronDown(cls = "size-4"): string {
  return `<svg class="${cls}" ${SVG_BASE}><path d="m6 9 6 6 6-6"/></svg>`;
}
