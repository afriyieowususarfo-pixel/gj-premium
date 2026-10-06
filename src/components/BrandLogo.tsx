import { cn } from "@/lib/utils";

/** Brand colors for the GJ Premium wordmark. */
export const BRAND_NAVY = "#0c4f8e";
export const BRAND_TEAL = "#1ba5a6";

/**
 * GJ Premium wordmark — the brand set as text only, with no symbol.
 * - `orientation="inline"`: single-line "GJ Premium" (header)
 * - `orientation="stacked"`: "GJ / Premium" over two lines (footer)
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
  const stacked = orientation === "stacked";

  return (
    <span className={cn("flex items-center", className)}>
      <span className="flex flex-col leading-none">
        {stacked ? (
          <>
            <span className="text-2xl font-bold tracking-tight text-brand-navy">
              GJ
            </span>
            <span className="text-2xl font-bold tracking-tight text-brand-teal">
              Premium
            </span>
          </>
        ) : (
          <span className="text-[19px] font-bold tracking-tight">
            <span className="text-brand-navy">GJ</span>{" "}
            <span className="text-brand-teal">Premium</span>
          </span>
        )}
        {tagline && (
          <span
            className={cn(
              "font-semibold text-brand-navy",
              stacked ? "mt-3 text-[11px]" : "mt-1 text-[9px]",
              "tracking-[0.3em]",
            )}
          >
            QUALITY · CARE · SUPPLY
          </span>
        )}
      </span>
    </span>
  );
}
