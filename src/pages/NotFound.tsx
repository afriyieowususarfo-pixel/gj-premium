import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

const SUGGESTIONS = [
  { label: "All ten product categories", to: "/products" },
  { label: "Request a quote", to: "/quote" },
  { label: "How the quote process works", to: "/#process" },
  { label: "Frequently asked questions", to: "/#faq" },
  { label: "Privacy policy", to: "/privacy" },
];

export default function NotFound() {
  usePageSeo({
    title: "Page not found | GJ Premium",
    description:
      "That page doesn't exist. Browse the ten product categories, request a quote, or head back to the home page.",
    path: "/404",
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div
            className={`${CONTAINER} grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-16`}
          >
            <div className="lg:col-span-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                Error 404
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
                Page not found.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                The page you asked for doesn&apos;t exist — it may have been
                moved, or the link may be mistyped. Everything on this site is
                one click away below.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-7 text-[15px]"
                >
                  <Link to="/">
                    Back to home
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Link
                  to="/quote"
                  className="text-[15px] font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground"
                >
                  Request a quote
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="border border-border">
                <p className="border-b border-border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Or go straight to
                </p>
                <ul className="divide-y divide-border">
                  {SUGGESTIONS.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center justify-between gap-4 px-6 py-4 text-sm transition-colors hover:bg-muted/60"
                      >
                        {link.label}
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
