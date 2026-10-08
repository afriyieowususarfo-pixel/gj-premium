import { cn } from "@/lib/utils";

/** Brand colors for the GJ Premium wordmark. */
export const BRAND_NAVY = "#0c4f8e";
export const BRAND_TEAL = "#1ba5a6";

/**
 * GJ Premium wordmark: plain text ("GJ" in brand navy, "Premium" in brand
 * teal). The colors map to the theme vars in index.css, so they lift
 * automatically in dark mode.
 * - `orientation="inline"`: header size
 * - `orientation="stacked"`: larger size for the footer block
 */
export function BrandLogo({
  className,
  orientation = "inline",
  tagline = false,
}: {
  className?: string;
  orientation?: "inline" | "stacked";
  tagline?: boolean;
}) {
  // `tagline` is kept so existing call sites stay meaningful
  // (and picks the larger size when set).
  const large = orientation === "stacked" || tagline;

  return (
    <span
      className={cn(
        "whitespace-nowrap font-bold tracking-tight leading-none",
        large ? "text-2xl" : "text-lg",
        className,
      )}
    >
      <span className="text-brand-navy">GJ</span>{" "}
      <span className="font-semibold text-brand-teal">Premium</span>
    </span>
  );
}
