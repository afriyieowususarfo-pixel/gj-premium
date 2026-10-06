import { FadeIn } from "@/components/FadeIn";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, quotePathFor } from "@/lib/catalog";
import { breadcrumbJsonLd, usePageSeo } from "@/lib/seo";
import { ArrowRight, Check } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";

const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

const ASSURANCES = [
  {
    number: "01",
    title: "Sourced from established manufacturers",
    description:
      "We buy from established medical supply manufacturers and check lots, expiry, and packaging on receipt, so what arrives matches what you ordered.",
  },
  {
    number: "02",
    title: "Documentation travels with the order",
    description:
      "Spec sheets, lot numbers, and expiry dates with every delivery. Declarations, certificates, and product data on request for your file.",
  },
  {
    number: "03",
    title: "Pack sizes you actually order in",
    description:
      "Cases, cartons, and individual units as the item is really sold, consolidated into one delivery on the schedule your facility runs on.",
  },
  {
    number: "04",
    title: "One specialist, quote to delivery",
    description:
      "The person who prices your request is the person who answers questions about it afterwards. No queue, no re-explaining your account.",
  },
];

export default function Products() {
  const location = useLocation();

  usePageSeo({
    title: "Medical supply product categories | GJ Premium",
    description:
      "Ten medical supply categories from GJ Premium: wound care, diabetes care, infusion, nutrition, continence, nursing, personal care, protection and surgical, with typical line items and one quote form.",
    path: "/products",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
      ]),
    ],
  });

  // Arriving from another route: start at the top…
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // …unless the URL carries a category hash (e.g. /products#wound-care).
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* ── Page header ──────────────────────────────────────── */}
        <section className="photo-wash border-b border-border">
          <div
            className={`${CONTAINER} grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-16`}
          >
            <FadeIn className="lg:col-span-6">
              <Breadcrumbs
                items={[{ label: "Products" }]}
                className="mb-7"
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                Products
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
                A total assortment,
                <br />
                quoted in one place.
              </h1>
            </FadeIn>

            <FadeIn className="lg:col-span-5 lg:col-start-8" delay={0.1}>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  GJ Premium supplies care settings across ten product
                  categories, from wound care to the operating room. Whatever
                  the mix, it goes on one request: items, quantities, delivery
                  location, and timing.
                </p>
                <p>
                  A supply specialist replies with pricing, availability, and a
                  delivery window within one business day.
                </p>
              </div>
              <div className="mt-7">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-7 text-[15px]"
                >
                  <Link to="/quote">
                    Request a quote
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Categories ───────────────────────────────────────── */}
        <section id="categories" className="scroll-mt-16">
          <div className={`${CONTAINER} py-20 md:py-28`}>
            <FadeIn>
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                    The assortment
                  </p>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                    Ten categories, described in plain language.
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5">
                  Supplier catalogues name things differently. These are the
                  categories we stock under, with the line items facilities ask
                  us for most. If your list crosses several of them, or none of
                  them neatly, send it anyway.
                </p>
              </div>
            </FadeIn>

            <FadeIn className="mt-12" delay={0.1}>
              <ul className="border-t border-border">
                {PRODUCT_CATEGORIES.map((category, index) => (
                  <li
                    key={category.slug}
                    id={category.slug}
                    className="scroll-mt-24 grid grid-cols-12 items-start gap-x-4 gap-y-4 border-b border-border py-7 transition-colors hover:bg-muted/40"
                  >
                    <span className="col-span-2 text-xs font-semibold tabular-nums tracking-[0.15em] text-muted-foreground md:col-span-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="col-span-10 md:col-span-4 lg:col-span-3">
                      <h3 className="text-base font-medium">{category.name}</h3>
                      <Link
                        to={quotePathFor(category.name)}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy transition-colors hover:text-foreground"
                      >
                        Request a quote
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>

                    <div className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {category.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-[13px] text-foreground"
                          >
                            <span
                              aria-hidden
                              className="h-1 w-1 rounded-full bg-brand-teal"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </section>

        {/* ── What you can count on ────────────────────────────── */}
        <section className="border-y border-border bg-muted/40">
          <div className={`${CONTAINER} py-20 md:py-28`}>
            <FadeIn>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                What you can count on
              </p>
              <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:col-span-7">
                  Supply that behaves the same way on every order.
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5">
                  Products matter, and so does everything around them: the
                  paperwork, the pack sizes, and the person you call.
                </p>
              </div>
            </FadeIn>

            <div className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
              {ASSURANCES.map((item, index) => (
                <FadeIn key={item.number} delay={index * 0.07}>
                  <div className="border-t border-foreground/20 pt-6">
                    <p className="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">
                      {item.number}
                    </p>
                    <h3 className="mt-4 text-base font-medium">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Not sure where it fits ───────────────────────────── */}
        <section className={`${CONTAINER} py-20 md:py-28`}>
          <FadeIn>
            <div className="grid gap-8 border border-border p-7 md:grid-cols-2 md:p-10">
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Not sure where it fits?
                  </p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight md:text-2xl">
                    Send the list anyway.
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Product names vary between suppliers and catalogues. Tell us
                    what you need in your own words, we sort the items into the
                    right categories and quote them together, including
                    equivalents where a line has been discontinued.
                  </p>
                </div>
                <div>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-7 text-[15px]"
                  >
                    <Link to="/quote">
                      Request a quote
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="md:border-l md:border-border md:pl-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Have these ready
                </p>
                <ul className="mt-5 space-y-3.5">
                  {[
                    "Items, quantities, and any model numbers",
                    "Your delivery address or service region",
                    "Your needed-by date",
                    "A work email for the quote",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-brand-teal"
                        strokeWidth={2.5}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────── */}
        <section className="bg-neutral-950 text-white">
          <div
            className={`${CONTAINER} flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20`}
          >
            <div>
              <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-teal">
                Quality · Care · Supply
              </p>
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Ten categories. One form. One business day.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
                Quotes for clinics, practices, labs, and care facilities, with
                pricing, availability, and a delivery window in the reply.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-7 text-[15px] text-neutral-950 hover:bg-neutral-200"
              >
                <Link to="/quote">
                  Request a quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <p className="text-xs text-neutral-500">
                Typical response: within one business day.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
