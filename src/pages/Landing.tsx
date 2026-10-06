import { FadeIn } from "@/components/FadeIn";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/catalog";
import { usePageSeo } from "@/lib/seo";
import { ArrowRight, Check } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";

const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

const FACTS = [
  {
    value: "1 business day",
    label: "Typical turnaround on a quote request.",
  },
  {
    value: "About 2 minutes",
    label: "To submit a request. No account needed.",
  },
  {
    value: "One specialist",
    label: "Your single contact, from quote to delivery.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Send your request",
    description:
      "Fill in the quote form: items and quantities, delivery location, and timing. It takes about two minutes — no account required.",
  },
  {
    number: "02",
    title: "We review the details",
    description:
      "A supply specialist checks availability, pack sizes, and suitable alternatives for your facility type.",
  },
  {
    number: "03",
    title: "Quote in your inbox",
    description:
      "You receive clear pricing, availability, and a delivery window — within one business day.",
  },
  {
    number: "04",
    title: "Approve and schedule",
    description:
      "Approve the quote and we schedule fulfillment. Questions? Reply to the email — the same specialist handles them.",
  },
];

const SITE_STEPS = [
  {
    number: "01",
    title: "See what we supply",
    description: "Ten product categories, with the typical line items in each.",
  },
  {
    number: "02",
    title: "Request a quote",
    description: "One short form. No account, no phone tag.",
  },
  {
    number: "03",
    title: "Get an answer",
    description: "Pricing and availability within one business day.",
  },
];

const CHECKLIST = [
  "Items, quantities, and any model numbers",
  "Your delivery address or service region",
  "Your needed-by date",
  "A work email for the quote",
];

const REQUEST_LINES = [
  { item: "Nitrile exam gloves", qty: "240 cs" },
  { item: "Fluid-resistant gowns", qty: "60 cs" },
  { item: "Wound dressing sets", qty: "120 ea" },
  { item: "Oximeter sensor strips", qty: "40 ea" },
];

const PROMISE = [
  {
    number: "01",
    title: "Within one business day",
    description:
      "Every request gets a written reply with pricing, availability and a delivery window — or a clear reason why we can't quote it.",
  },
  {
    number: "02",
    title: "In writing, with a reference",
    description:
      "The quote arrives by email under your reference number, so there is a record you can compare, forward, and reply to.",
  },
  {
    number: "03",
    title: "No waiting on us",
    description:
      "If something in your list is ambiguous, we ask before quoting instead of going quiet — one specialist owns the thread.",
  },
];

const CASE_STUDIES = [
  {
    label: "Multi-site dental group",
    title: "Four locations, one order list",
    challenge:
      "Each clinic bought separately, at different prices, from different reps — and nobody could see the total.",
    approach:
      "One shared assortment and price list across the group, ordered through a single contact and delivered on one schedule.",
    outcome:
      "One invoice, one person to call, and no per-site reordering.",
  },
  {
    label: "Home health agency",
    title: "Wound kits built to the care plan",
    challenge:
      "Nurses were assembling dressing kits by hand before every visit, and running out of the slow movers at short notice.",
    approach:
      "Pre-assembled kits matched to their four most common care plans, replenished against a standing list.",
    outcome:
      "Less time picking, fewer emergency orders, kits that match the plan.",
  },
  {
    label: "Rural urgent-care clinic",
    title: "Covering the gaps in a small store room",
    challenge:
      "Low volumes meant high minimums, long lead times, and discontinued lines arriving as surprises.",
    approach:
      "Quantities quoted in the pack sizes they actually use, with equivalents proposed whenever a line was discontinued.",
    outcome:
      "Stock that turns before it expires, and no dead ends on a reorder.",
  },
];

const FAQ: {
  question: string;
  answer: string;
  link?: { label: string; to: string };
}[] = [
  {
    question: "How quickly will I get a quote?",
    answer:
      "Within one business day. You get pricing, availability, and a delivery window in writing, under a reference number.",
  },
  {
    question: "Do I need an account to order?",
    answer:
      "No. There is nothing to sign up for — one short form, and a supply specialist replies to your work email.",
  },
  {
    question: "What should I include in the request?",
    answer:
      "Items and quantities, your delivery location, and your needed-by date. Model numbers help, but plain descriptions are fine.",
    link: { label: "See what to include", to: "/quote#checklist" },
  },
  {
    question: "Does it cost anything to request a quote?",
    answer:
      "Nothing. Quotes are free and carry no obligation — the figure arrives so you can compare it against what you pay today.",
  },
  {
    question: "Who do you supply?",
    answer:
      "Clinics, medical practices, laboratories, pharmacies, dental practices, long-term care and home-health agencies — across all ten categories we stock.",
    link: { label: "See the categories", to: "/products" },
  },
  {
    question: "What if an item isn't in your list?",
    answer:
      "Send it anyway. Catalogue names differ between suppliers; we sort your list into the right categories, and propose equivalents where a line is discontinued.",
    link: { label: "See how sourcing works", to: "/products#categories" },
  },
  {
    question: "How long is a quote valid?",
    answer:
      "The validity period is stated on the quote itself, so you have a date you can plan a decision around rather than a moving target.",
  },
  {
    question: "Where do you deliver, and how fast?",
    answer:
      "Delivery is quoted per request: include your address or service region and the quote comes back with a delivery window for that location.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Landing() {
  const location = useLocation();

  usePageSeo({
    title: "GJ Premium — Medical Supply, Quoted in One Business Day",
    description:
      "GJ Premium supplies clinics, practices, labs and care facilities across ten medical supply categories. Request a quote and get pricing, availability and a delivery window within one business day.",
    path: "/",
    jsonLd: [FAQ_JSON_LD],
  });

  // Arriving from another route: start at the top…
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // …unless the URL carries a section hash (e.g. /#process from the quote page).
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
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          id="overview"
          className="photo-wash scroll-mt-16 border-b border-border"
        >
          <div
            className={`${CONTAINER} grid items-center gap-12 pb-16 pt-16 md:pb-24 md:pt-24 lg:grid-cols-12 lg:gap-16`}
          >
            <div className="lg:col-span-7">
              <FadeIn>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                  Quality · Care · Supply
                </p>
                <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                  Medical supplies,
                  <br />
                  without the runaround.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  GJ Premium keeps clinics, practices, and care facilities
                  stocked with the everyday essentials of patient care. This
                  site is simple by design: tell us what you need, and a supply
                  specialist replies with a clear quote — usually within one
                  business day.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
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
                  <a
                    href="#process"
                    className="text-[15px] font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground"
                  >
                    See how it works
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Quote-request preview card */}
            <FadeIn className="lg:col-span-5" delay={0.15}>
              <div className="border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Quote request
                  </p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    #GJ-P-4821
                  </p>
                </div>
                <p className="mt-1.5 text-sm text-foreground">
                  Hillside Family Clinic
                </p>

                <div className="mt-6 space-y-3.5 border-t border-border pt-5">
                  {REQUEST_LINES.map((line) => (
                    <div key={line.item} className="flex items-baseline gap-3">
                      <span className="text-sm text-foreground">
                        {line.item}
                      </span>
                      <span
                        aria-hidden
                        className="-translate-y-1 flex-1 border-b border-dotted border-border"
                      />
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {line.qty}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-5">
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand-teal/10">
                    <Check className="size-3 text-brand-teal" strokeWidth={3} />
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Response within{" "}
                    <span className="text-foreground">one business day</span>
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Facts row */}
          <div className={`${CONTAINER} border-t border-border`}>
            <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {FACTS.map((fact) => (
                <div
                  key={fact.value}
                  className="py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0"
                >
                  <dt className="text-xl font-semibold tracking-tight md:text-2xl">
                    {fact.value}
                  </dt>
                  <dd className="mt-1.5 text-sm text-muted-foreground">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Introduction ─────────────────────────────────────── */}
        <section className={`${CONTAINER} py-20 md:py-28`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                Introduction
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Who we are — and what this website is for.
              </h2>
            </FadeIn>

            <FadeIn className="lg:col-span-6 lg:col-start-7" delay={0.1}>
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-[17px]">
                <p className="text-foreground">
                  GJ Premium is a medical supply company. We keep care settings
                  stocked with the products they use every day — gloves, gowns,
                  dressings, diagnostics, and consumables — in the pack sizes
                  you actually order.
                </p>
                <p>
                  This website exists to make one thing simple: getting a
                  quote. There is no account to create and no phone tag. You
                  tell us what your facility needs, and a supply specialist
                  replies with pricing, availability, and delivery timing.
                </p>
              </div>

              <div className="mt-9 border border-border">
                <p className="border-b border-border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  What to do here
                </p>
                <ul className="divide-y divide-border">
                  {SITE_STEPS.map((step) => (
                    <li key={step.number} className="flex gap-5 px-6 py-4">
                      <span className="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">
                        {step.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── What we supply ───────────────────────────────────── */}
        <section id="supply" className="scroll-mt-16 border-y border-border bg-muted/40">
          <div className={`${CONTAINER} py-20 md:py-28`}>
            <FadeIn>
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                    What we supply
                  </p>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                    The essentials of patient care, kept in stock.
                  </h2>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Ten categories, from wound care to the operating room —
                    each one with the line items facilities ask us for most.
                  </p>
                  <Link
                    to="/products"
                    className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground"
                  >
                    See the full assortment
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn className="mt-12" delay={0.1}>
              <ul className="border-t border-border">
                {PRODUCT_CATEGORIES.map((category, index) => (
                  <li
                    key={category.name}
                    className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-b border-border py-6 transition-colors hover:bg-background/60"
                  >
                    <span className="col-span-2 text-xs font-semibold tabular-nums tracking-[0.15em] text-muted-foreground md:col-span-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="col-span-10 text-base font-medium md:col-span-4 lg:col-span-3">
                      <Link
                        to={`/products#${category.slug}`}
                        className="transition-colors hover:text-brand-navy"
                      >
                        {category.name}
                      </Link>
                    </h3>
                    <p className="col-span-12 text-sm leading-relaxed text-muted-foreground md:col-span-7 lg:col-span-7 lg:col-start-6">
                      {category.description}
                    </p>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </section>

        {/* ── Quote process ────────────────────────────────────── */}
        <section id="process" className={`${CONTAINER} scroll-mt-16 py-20 md:py-28`}>
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
              How it works
            </p>
            <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:col-span-7">
                From request to quote, in four steps.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5">
                No account, no phone tag. Here is exactly what happens after
                you press submit.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.07}>
                <div className="border-t border-foreground/20 pt-6">
                  <p className="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">
                    {step.number}
                  </p>
                  <h3 className="mt-4 text-base font-medium">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-14" delay={0.1}>
            <div className="grid gap-8 border border-border p-7 md:grid-cols-2 md:p-10">
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Ready to request a quote?
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Have your list, delivery address, and needed-by date at
                    hand. The form takes about two minutes.
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
                  {CHECKLIST.map((item) => (
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

        {/* ── Response-time promise ───────────────────────────── */}
        <section
          id="promise"
          className="scroll-mt-16 border-y border-border bg-muted/40"
        >
          <div className={`${CONTAINER} py-20 md:py-24`}>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <FadeIn className="lg:col-span-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                  Response-time promise
                </p>
                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  One business day, in writing.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                  If we ever miss it, you get a reason and a revised date the
                  same way — you should never be left wondering whether
                  anyone read your request.
                </p>
                <div className="mt-8">
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

              <FadeIn className="lg:col-span-6 lg:col-start-7" delay={0.1}>
                <ol className="border-t border-border">
                  {PROMISE.map((item) => (
                    <li
                      key={item.number}
                      className="flex gap-5 border-b border-border py-6"
                    >
                      <span className="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">
                        {item.number}
                      </span>
                      <div>
                        <p className="text-base font-medium">{item.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Case studies ────────────────────────────────────── */}
        <section id="cases" className="scroll-mt-16">
          <div className={`${CONTAINER} py-20 md:py-28`}>
            <FadeIn>
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                    Case studies
                  </p>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                    How supply actually gets fixed.
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5">
                  Three real shapes of problem — bought in parallel, picked by
                  hand, and stranded on a long lead time — and what changed
                  once the list moved to one supplier.
                </p>
              </div>
            </FadeIn>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {CASE_STUDIES.map((study, index) => (
                <FadeIn
                  key={study.title}
                  delay={index * 0.07}
                  className="h-full"
                >
                  <article className="flex h-full flex-col border border-border p-6 md:p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-navy">
                      {study.label}
                    </p>
                    <h3 className="mt-4 text-lg font-medium leading-snug">
                      {study.title}
                    </h3>
                    <dl className="mt-6 space-y-4 text-sm">
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Challenge
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-muted-foreground">
                          {study.challenge}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          What we did
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-muted-foreground">
                          {study.approach}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Outcome
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-foreground">
                          {study.outcome}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </FadeIn>
              ))}
            </div>

            <FadeIn className="mt-10" delay={0.1}>
              <p className="text-sm text-muted-foreground">
                Facing something similar?{" "}
                <Link
                  to="/quote"
                  className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  Tell us what you need
                </Link>{" "}
                — you get the fix priced back within one business day.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-16 border-t border-border">
          <div className={`${CONTAINER} py-20 md:py-28`}>
            <FadeIn>
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
                    FAQ
                  </p>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                    Questions, answered.
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5">
                  Anything not covered here?{" "}
                  <Link
                    to="/quote"
                    className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    Ask in the quote form
                  </Link>{" "}
                  — the notes field reaches the same specialist.
                </p>
              </div>
            </FadeIn>

            <dl className="mt-12 border-t border-border">
              {FAQ.map((item) => (
                <div
                  key={item.question}
                  className="grid gap-x-4 gap-y-2 border-b border-border py-6 md:grid-cols-12"
                >
                  <dt className="text-base font-medium md:col-span-5">
                    {item.question}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
                    {item.answer}{" "}
                    {item.link && (
                      <Link
                        to={item.link.to}
                        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                      >
                        {item.link.label}
                      </Link>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
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
                Tell us what you need. We&apos;ll price it.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
                One form, one specialist, one business day. Quotes for clinics,
                practices, labs, and care facilities.
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
