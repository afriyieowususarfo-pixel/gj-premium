import { cn } from "@/lib/utils";

/** Brand colors for the GJ Premium wordmark. */
export const BRAND_NAVY = "#0c4f8e";
export const BRAND_TEAL = "#1ba5a6";

/**
 * GJ Premium logo: the full lockup (monogram with sparkle and swoosh,
 * "GJ Premium" wordmark, and the Quality · Care · Supply tagline) served
 * from /logo-full.svg. To swap in a new logo file, replace that asset; no
 * code changes needed.
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
  // The tagline is part of the artwork; the prop is kept so existing
  // call sites stay meaningful (and picks the larger size when set).
  const large = orientation === "stacked" || tagline;

  return (
    <img
      src="/logo-full.svg"
      alt="GJ Premium logo"
      width={770}
      height={213}
      className={cn("h-9 w-auto", large && "h-12", className)}
    />
  );
}
