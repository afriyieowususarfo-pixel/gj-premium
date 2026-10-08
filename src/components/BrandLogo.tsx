import { cn } from "@/lib/utils";

/** Brand colors for the GJ Premium wordmark. */
export const BRAND_NAVY = "#0c4f8e";
export const BRAND_TEAL = "#1ba5a6";

/**
 * GJ Premium logo: the full lockup (monogram with sparkle and swoosh,
 * "GJ Premium" wordmark, and the Quality · Care · Supply tagline).
 * The light artwork lives in /logo-full.svg and a variant with lifted
 * navy/teal in /logo-full-dark.svg; the `.dark` class (toggled by
 * next-themes, following the OS setting) picks between them.
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
  const size = cn("h-9 w-auto", large && "h-12", className);

  return (
    <>
      <img
        src="/logo-full.svg"
        alt="GJ Premium logo"
        width={770}
        height={213}
        className={cn("block dark:hidden", size)}
      />
      <img
        src="/logo-full-dark.svg"
        alt="GJ Premium logo"
        width={770}
        height={213}
        className={cn("hidden dark:block", size)}
      />
    </>
  );
}
