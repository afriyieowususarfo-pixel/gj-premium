import { BrandLogo } from "@/components/BrandLogo";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

type NavItem = { label: string; to: string; hash?: string };

const NAV_LINKS: NavItem[] = [
  { label: "Overview", to: "/", hash: "#overview" },
  { label: "Products", to: "/products" },
  { label: "Process", to: "/", hash: "#process" },
];

/**
 * Light/dark switch, mirroring the static site's header toggle. The label
 * names what the click will do next; `next-themes` persists the choice
 * under localStorage["theme"], the same key the page's inline bootstrap
 * reads before first paint. It resolves that theme synchronously on the
 * first client render, so no mount gate is needed here.
 */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const label = dark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function SiteHeader() {
  const location = useLocation();

  // Native anchor clicks change the URL hash without a router navigation,
  // so track the live hash as well as the router's.
  const [hash, setHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash,
  );
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [location.pathname, location.hash]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
          <Link
            to="/"
            aria-label="GJ Premium home"
            className="transition-opacity hover:opacity-80"
          >
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = link.hash
                ? location.pathname === "/" && hash === link.hash
                : location.pathname === link.to;
              const className = `text-sm transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`;

              // On the landing page, plain anchors scroll natively; from other
              // routes, route through the router and let the page handle the hash.
              return link.hash && location.pathname === "/" ? (
                <a key={link.label} href={link.hash} className={className}>
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.hash ? `/${link.hash}` : link.to}
                  className={className}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Button asChild size="sm" className="rounded-full px-4 text-[13px]">
              <Link to="/quote">
                Request a quote
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <MobileCtaBar />
    </>
  );
}
