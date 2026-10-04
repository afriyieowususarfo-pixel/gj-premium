import { cn } from "@/lib/utils";

/** Colors sampled from the GJ Premium logo. */
export const BRAND_NAVY = "#0c4f8e";
export const BRAND_TEAL = "#1ba5a6";

/**
 * The GJ Premium monogram: a navy "G" ring with crossbar, a teal "J",
 * a sweeping crescent, and a four-point sparkle.
 */
export function Monogram({
  className,
  title = "GJ Premium",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 94"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* G — ring open on the right */}
      <path
        d="M70.6 32.8A30 30 0 1 0 70.6 67.2"
        stroke={BRAND_NAVY}
        strokeWidth="13"
      />
      {/* G — crossbar */}
      <rect x="58" y="44" width="18" height="13" fill={BRAND_NAVY} />
      {/* J — stem and hook */}
      <path
        d="M84 6V62Q84 84 62 84Q48 84 50 74"
        stroke={BRAND_TEAL}
        strokeWidth="13"
        fill="none"
      />
      {/* Swoosh — crescent sweeping under the mark */}
      <path
        d="M96 24C80 74 32 94 4 32C30 76 74 58 96 24Z"
        fill={BRAND_TEAL}
      />
      {/* Sparkle */}
      <path
        d="M44 35Q46 43 57 48Q46 53 44 61Q42 53 31 48Q42 43 44 35Z"
        fill={BRAND_TEAL}
      />
    </svg>
  );
}

/**
 * Full logo lockup.
 * - `orientation="inline"`: monogram + one-line wordmark (header)
 * - `orientation="stacked"`: monogram + GJ / Premium / tagline (footer, hero)
 */
export function BrandLogo({
  className,
  monogramClassName,
  orientation = "inline",
  tagline = false,
}: {
  className?: string;
  monogramClassName?: string;
  orientation?: "inline" | "stacked";
  tagline?: boolean;
}) {
  const stacked = orientation === "stacked";

  return (
    <span
      className={cn(
        "flex items-center",
        stacked ? "gap-4" : "gap-2.5",
        className,
      )}
    >
      <Monogram
        className={cn(
          "shrink-0",
          stacked ? "h-14 w-auto" : "h-9 w-auto",
          monogramClassName,
        )}
      />
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
          <span className="text-[17px] font-bold tracking-tight">
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
