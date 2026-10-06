import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";

/**
 * Sticky call-to-action for phones: always one tap from a quote request.
 * Hidden on md+ screens and on the quote form itself, where it would be
 * redundant.
 */
export function MobileCtaBar() {
  const location = useLocation();
  if (location.pathname === "/quote") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Reply within one business day
          </p>
          <p className="truncate text-sm font-medium">
            Tell us what you need
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="shrink-0 rounded-full px-4 text-[13px]"
        >
          <Link to="/quote">
            Request a quote
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
