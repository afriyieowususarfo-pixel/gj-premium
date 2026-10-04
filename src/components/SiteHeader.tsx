import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const NAV_LINKS = [
  { label: "Overview", hash: "#overview" },
  { label: "What we supply", hash: "#supply" },
  { label: "Process", hash: "#process" },
];

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
            const isActive = location.pathname === "/" && hash === link.hash;
            const className = `text-sm transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`;

            // On the landing page, plain anchors scroll natively; from other
            // routes, route through the router and let Landing handle the hash.
            return location.pathname === "/" ? (
              <a key={link.hash} href={link.hash} className={className}>
                {link.label}
              </a>
            ) : (
              <Link key={link.hash} to={`/${link.hash}`} className={className}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Button asChild size="sm" className="rounded-full px-4 text-[13px]">
          <Link to="/quote">
            Request a quote
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
