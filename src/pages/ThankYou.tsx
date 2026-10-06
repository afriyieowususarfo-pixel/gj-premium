import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/lib/seo";
import { ArrowRight, Check } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

const NEXT_STEPS = [
  {
    number: "01",
    title: "We review the details",
    description:
      "A supply specialist checks availability, pack sizes, and suitable alternatives for your facility type.",
  },
  {
    number: "02",
    title: "Quote in your inbox, within one business day",
    description:
      "Pricing, availability, and a delivery window arrive by email under the reference above.",
  },
  {
    number: "03",
    title: "You approve",
    description:
      "Reply to the email to confirm, and we schedule fulfillment. Questions go to the same specialist.",
  },
];

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("ref")?.trim() || null;

  usePageSeo({
    title: "Thank you — request received | GJ Premium",
    description:
      "Your quote request has been received. A supply specialist will reply with pricing, availability and a delivery window within one business day.",
    path: "/thank-you",
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="photo-wash border-b border-border">
          <div className={`${CONTAINER} py-14 md:py-16`}>
            <Breadcrumbs
              items={[{ label: "Thank you" }]}
              className="mb-7"
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
              Request received
            </p>
            <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:col-span-7">
                Thank you — we have your list.
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5">
                Nothing else to do. A supply specialist is already working on
                it, and your quote arrives by email within one business day.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`${CONTAINER} grid gap-12 py-14 md:py-16 lg:grid-cols-12 lg:gap-16`}
        >
          <div className="lg:col-span-7">
            <div className="border border-border p-7 md:p-10">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-teal/10">
                <Check className="size-5 text-brand-teal" strokeWidth={2.5} />
              </span>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
                Request received.
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                We have logged your request and a confirmation is on its way.
                Keep the reference below for your records — it is what we will
                quote under.
              </p>

              <dl className="mt-8 border-t border-border text-sm">
                <div className="flex items-baseline justify-between gap-4 border-b border-border py-3.5">
                  <dt className="text-muted-foreground">Your reference</dt>
                  <dd className="text-right font-semibold tabular-nums">
                    {reference ?? "On its way by email"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-border py-3.5">
                  <dt className="text-muted-foreground">Reply by</dt>
                  <dd className="text-right font-medium">
                    Within one business day
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-7 text-[15px]"
                >
                  <Link to="/products">
                    Browse the assortment
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Link
                  to="/"
                  className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  What happens next
                </p>
                <ol className="mt-5 space-y-5">
                  {NEXT_STEPS.map((step) => (
                    <li key={step.number} className="flex gap-4">
                      <span className="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">
                        {step.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Need to add something?
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <a
                      href="mailto:quotes@gjpremium.com"
                      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      quotes@gjpremium.com
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    Reply to your confirmation email, or send the additions with
                    your reference number.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
