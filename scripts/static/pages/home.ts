import { PRODUCT_CATEGORIES } from "../../../src/lib/catalog.ts";
import {
  BTN_LIGHT_LG,
  BTN_PRIMARY_LG,
  iconArrowRight,
  iconCheck,
} from "../ui.ts";
import { CONTAINER, SITE_URL, esc, type PageInput } from "../site.ts";

/** `FadeIn` replacement: a short fade + lift, revealed by IntersectionObserver. */
function reveal(className = "", delay = 0): string {
  const style = delay ? ` style="--reveal-delay:${delay}s"` : "";
  return `<div class="reveal${className ? ` ${className}` : ""}"${style}>`;
}

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
      "Fill in the quote form: items and quantities, delivery location, and timing. It takes about two minutes, with no account required.",
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
      "You receive clear pricing, availability, and a delivery window within one business day.",
  },
  {
    number: "04",
    title: "Approve and schedule",
    description:
      "Approve the quote and we schedule fulfillment. Questions? Reply to the email; the same specialist handles them.",
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
      "Every request gets a written reply with pricing, availability and a delivery window, or a clear reason why we can't quote it.",
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
      "If something in your list is ambiguous, we ask before quoting instead of going quiet. One specialist owns the thread.",
  },
];

const CASE_STUDIES = [
  {
    label: "Multi-site dental group",
    title: "Four locations, one order list",
    challenge:
      "Each clinic bought separately, at different prices, from different reps, and nobody could see the total.",
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
      "No. There is nothing to sign up for: one short form, and a supply specialist replies to your work email.",
  },
  {
    question: "What should I include in the request?",
    answer:
      "Items and quantities, your delivery location, and your needed-by date. Model numbers help, but plain descriptions are fine.",
    link: { label: "See what to include", to: "/quote/#checklist" },
  },
  {
    question: "Does it cost anything to request a quote?",
    answer:
      "Nothing. Quotes are free and carry no obligation: the figure arrives so you can compare it against what you pay today.",
  },
  {
    question: "Who do you supply?",
    answer:
      "Clinics, medical practices, laboratories, pharmacies, dental practices, long-term care and home-health agencies, across all ten categories we stock.",
    link: { label: "See the categories", to: "/products/" },
  },
  {
    question: "What if an item isn't in your list?",
    answer:
      "Send it anyway. Catalogue names differ between suppliers; we sort your list into the right categories, and propose equivalents where a line is discontinued.",
    link: { label: "See how sourcing works", to: "/products/#categories" },
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

function textLink(label: string, href: string): string {
  return `<a href="${href}" class="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">${esc(
    label,
  )}</a>`;
}

function checkList(items: string[]): string {
  return items
    .map(
      (item) =>
        `<li class="flex items-start gap-3 text-sm text-foreground">${iconCheck(
          "mt-0.5 size-4 shrink-0 text-brand-teal",
        )}${esc(item)}</li>`,
    )
    .join("\n                    ");
}

function closingCta(headline: string, subline: string): string {
  return `<section class="bg-neutral-950 text-white">
        <div class="${CONTAINER} flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p class="mb-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-teal">Quality &middot; Care &middot; Supply</p>
            <h2 class="max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">${headline}</h2>
            <p class="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">${subline}</p>
          </div>
          <div class="flex flex-col items-start gap-4">
            <a href="/quote/" class="${BTN_LIGHT_LG}">Request a quote${iconArrowRight(
              "size-4",
            )}</a>
            <p class="text-xs text-neutral-500">Typical response: within one business day.</p>
          </div>
        </div>
      </section>`;
}

export const homeCta = closingCta;

export function homePage(): PageInput {
  const facts = FACTS.map(
    (fact) => `<div class="py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                  <dt class="text-xl font-semibold tracking-tight md:text-2xl">${esc(
                    fact.value,
                  )}</dt>
                  <dd class="mt-1.5 text-sm text-muted-foreground">${esc(
                    fact.label,
                  )}</dd>
                </div>`,
  ).join("\n              ");

  const siteSteps = SITE_STEPS.map(
    (step) => `<li class="flex gap-5 px-6 py-4">
                      <span class="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">${step.number}</span>
                      <div>
                        <p class="text-sm font-medium">${esc(step.title)}</p>
                        <p class="mt-1 text-sm text-muted-foreground">${esc(
                          step.description,
                        )}</p>
                      </div>
                    </li>`,
  ).join("\n                  ");

  const supplyRows = PRODUCT_CATEGORIES.map(
    (category, index) => `<li class="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-b border-border py-6 transition-colors hover:bg-background/60">
                    <span class="col-span-2 text-xs font-semibold tabular-nums tracking-[0.15em] text-muted-foreground md:col-span-1">${String(
                      index + 1,
                    ).padStart(2, "0")}</span>
                    <h3 class="col-span-10 text-base font-medium md:col-span-4 lg:col-span-3"><a href="/products/#${category.slug}" class="transition-colors hover:text-brand-navy">${esc(
                      category.name,
                    )}</a></h3>
                    <p class="col-span-12 text-sm leading-relaxed text-muted-foreground md:col-span-7 lg:col-span-7 lg:col-start-6">${esc(
                      category.description,
                    )}</p>
                  </li>`,
  ).join("\n              ");

  const steps = STEPS.map(
    (step, index) =>
      `${reveal("", index * 0.07)}<div class="border-t border-foreground/20 pt-6">
                  <p class="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">${step.number}</p>
                  <h3 class="mt-4 text-base font-medium">${esc(step.title)}</h3>
                  <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">${esc(
                    step.description,
                  )}</p>
                </div></div>`,
  ).join("\n            ");

  const promise = PROMISE.map(
    (item) => `<li class="flex gap-5 border-b border-border py-6">
                      <span class="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">${item.number}</span>
                      <div>
                        <p class="text-base font-medium">${esc(item.title)}</p>
                        <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">${esc(
                          item.description,
                        )}</p>
                      </div>
                    </li>`,
  ).join("\n                  ");

  const cases = CASE_STUDIES.map(
    (study, index) =>
      `${reveal(" h-full", index * 0.07)}<article class="flex h-full flex-col border border-border p-6 md:p-7">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-navy">${esc(
                      study.label,
                    )}</p>
                    <h3 class="mt-4 text-lg font-medium leading-snug">${esc(
                      study.title,
                    )}</h3>
                    <dl class="mt-6 space-y-4 text-sm">
                      <div>
                        <dt class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Challenge</dt>
                        <dd class="mt-1.5 leading-relaxed text-muted-foreground">${esc(
                          study.challenge,
                        )}</dd>
                      </div>
                      <div>
                        <dt class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we did</dt>
                        <dd class="mt-1.5 leading-relaxed text-muted-foreground">${esc(
                          study.approach,
                        )}</dd>
                      </div>
                      <div>
                        <dt class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Outcome</dt>
                        <dd class="mt-1.5 leading-relaxed text-foreground">${esc(
                          study.outcome,
                        )}</dd>
                      </div>
                    </dl>
                  </article></div>`,
  ).join("\n            ");

  const faq = FAQ.map(
    (item) => `<div class="grid gap-x-4 gap-y-2 border-b border-border py-6 md:grid-cols-12">
                  <dt class="text-base font-medium md:col-span-5">${esc(
                    item.question,
                  )}</dt>
                  <dd class="text-sm leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">${esc(
                    item.answer,
                  )} ${
                    item.link
                      ? textLink(item.link.label, item.link.to)
                      : ""
                  }</dd>
                </div>`,
  ).join("\n            ");

  const requestLines = REQUEST_LINES.map(
    (line) => `<div class="flex items-baseline gap-3">
                      <span class="text-sm text-foreground">${esc(line.item)}</span>
                      <span aria-hidden class="-translate-y-1 flex-1 border-b border-dotted border-border"></span>
                      <span class="text-sm tabular-nums text-muted-foreground">${esc(
                        line.qty,
                      )}</span>
                    </div>`,
  ).join("\n                  ");

  const content = `        <!-- Hero -->
        <section id="overview" class="photo-wash scroll-mt-16 border-b border-border">
          <div class="${CONTAINER} grid items-center gap-12 pb-16 pt-16 md:pb-24 md:pt-24 lg:grid-cols-12 lg:gap-16">
            <div class="lg:col-span-7">
              ${reveal()}<p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Quality &middot; Care &middot; Supply</p>
                <h1 class="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Medical supplies,<br />without the runaround.</h1>
                <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">GJ Premium keeps clinics, practices, and care facilities stocked with the everyday essentials of patient care. This site is simple by design: tell us what you need, and a supply specialist replies with a clear quote, usually within one business day.</p>
                <div class="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <a href="/quote/" class="${BTN_PRIMARY_LG}">Request a quote${iconArrowRight(
                    "size-4",
                  )}</a>
                  <a href="#process" class="text-[15px] font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground">See how it works</a>
                </div>
              </div>
            </div>

            ${reveal(" lg:col-span-5", 0.15)}<div class="border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
                <div class="flex items-baseline justify-between">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Quote request</p>
                  <p class="text-xs tabular-nums text-muted-foreground">#GJ-P-4821</p>
                </div>
                <p class="mt-1.5 text-sm text-foreground">Hillside Family Clinic</p>

                <div class="mt-6 space-y-3.5 border-t border-border pt-5">
                  ${requestLines}
                </div>

                <div class="mt-6 flex items-center gap-2.5 border-t border-border pt-5">
                  <span class="flex size-5 items-center justify-center rounded-full bg-brand-teal/10">${iconCheck(
                    "size-3 text-brand-teal",
                    3,
                  )}</span>
                  <p class="text-sm text-muted-foreground">Response within <span class="text-foreground">one business day</span></p>
                </div>
            </div></div>
          </div>

          <div class="${CONTAINER} border-t border-border">
            <dl class="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              ${facts}
            </dl>
          </div>
        </section>

        <!-- Introduction -->
        <section class="${CONTAINER} py-20 md:py-28">
          <div class="grid gap-10 lg:grid-cols-12 lg:gap-16">
            ${reveal(" lg:col-span-5")}<p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Introduction</p>
              <h2 class="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Who we are, and what this website is for.</h2>
            </div>

            ${reveal(
              " lg:col-span-6 lg:col-start-7",
              0.1,
            )}<div class="space-y-5 text-base leading-relaxed text-muted-foreground md:text-[17px]">
                <p class="text-foreground">GJ Premium is a medical supply company. We keep care settings stocked with the products they use every day: gloves, gowns, dressings, diagnostics, and consumables, in the pack sizes you actually order.</p>
                <p>This website exists to make one thing simple: getting a quote. There is no account to create and no phone tag. You tell us what your facility needs, and a supply specialist replies with pricing, availability, and delivery timing.</p>
              </div>

              <div class="mt-9 border border-border">
                <p class="border-b border-border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">What to do here</p>
                <ul class="divide-y divide-border">
                  ${siteSteps}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- What we supply -->
        <section id="supply" class="scroll-mt-16 border-y border-border bg-muted/40">
          <div class="${CONTAINER} py-20 md:py-28">
            ${reveal()}<div class="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div class="lg:col-span-7">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">What we supply</p>
                  <h2 class="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">The essentials of patient care, kept in stock.</h2>
                </div>
                <div class="lg:col-span-5">
                  <p class="text-base leading-relaxed text-muted-foreground">Ten categories, from wound care to the operating room, each one with the line items facilities ask us for most.</p>
                  <a href="/products/" class="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground">See the full assortment${iconArrowRight(
                    "size-4",
                  )}</a>
                </div>
            </div></div>

            ${reveal(" mt-12", 0.1)}<ul class="border-t border-border">
                ${supplyRows}
              </ul>
            </div>
          </div>
        </section>

        <!-- Quote process -->
        <section id="process" class="${CONTAINER} scroll-mt-16 py-20 md:py-28">
          ${reveal()}<p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">How it works</p>
            <div class="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
              <h2 class="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:col-span-7">From request to quote, in four steps.</h2>
              <p class="text-base leading-relaxed text-muted-foreground lg:col-span-5">No account, no phone tag. Here is exactly what happens after you press submit.</p>
            </div>
          </div>

          <div class="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            ${steps}
          </div>

          ${reveal(" mt-14", 0.1)}<div class="grid gap-8 border border-border p-7 md:grid-cols-2 md:p-10">
              <div class="flex flex-col justify-between gap-6">
                <div>
                  <h3 class="text-xl font-semibold tracking-tight md:text-2xl">Ready to request a quote?</h3>
                  <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Have your list, delivery address, and needed-by date at hand. The form takes about two minutes.</p>
                </div>
                <div>
                  <a href="/quote/" class="${BTN_PRIMARY_LG}">Request a quote${iconArrowRight(
                    "size-4",
                  )}</a>
                </div>
              </div>

              <div class="md:border-l md:border-border md:pl-10">
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Have these ready</p>
                <ul class="mt-5 space-y-3.5">
                  ${checkList(CHECKLIST)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Response-time promise -->
        <section id="promise" class="scroll-mt-16 border-y border-border bg-muted/40">
          <div class="${CONTAINER} py-20 md:py-24">
            <div class="grid gap-10 lg:grid-cols-12 lg:gap-16">
              ${reveal(" lg:col-span-5")}<p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Response-time promise</p>
                <h2 class="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">One business day, in writing.</h2>
                <p class="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">If we ever miss it, you get a reason and a revised date the same way, so you should never be left wondering whether anyone read your request.</p>
                <div class="mt-8">
                  <a href="/quote/" class="${BTN_PRIMARY_LG}">Request a quote${iconArrowRight(
                    "size-4",
                  )}</a>
                </div>
              </div>

              ${reveal(
                " lg:col-span-6 lg:col-start-7",
                0.1,
              )}<ol class="border-t border-border">
                  ${promise}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <!-- Case studies -->
        <section id="cases" class="scroll-mt-16">
          <div class="${CONTAINER} py-20 md:py-28">
            ${reveal()}<div class="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div class="lg:col-span-7">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Case studies</p>
                  <h2 class="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">How supply actually gets fixed.</h2>
                </div>
                <p class="text-base leading-relaxed text-muted-foreground lg:col-span-5">Three real shapes of problem: bought in parallel, picked by hand, and stranded on a long lead time, and what changed once the list moved to one supplier.</p>
            </div></div>

            <div class="mt-12 grid gap-6 md:grid-cols-3">
              ${cases}
            </div>

            ${reveal(
              " mt-10",
              0.1,
            )}<p class="text-sm text-muted-foreground">Facing something similar? ${textLink(
              "Tell us what you need",
              "/quote/",
            )} and you get the fix priced back within one business day.</p>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="scroll-mt-16 border-t border-border">
          <div class="${CONTAINER} py-20 md:py-28">
            ${reveal()}<div class="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div class="lg:col-span-7">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">FAQ</p>
                  <h2 class="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Questions, answered.</h2>
                </div>
                <p class="text-base leading-relaxed text-muted-foreground lg:col-span-5">Anything not covered here? ${textLink(
                  "Ask in the quote form",
                  "/quote/",
                )}, since the notes field reaches the same specialist.</p>
            </div></div>

            <dl class="mt-12 border-t border-border">
              ${faq}
            </dl>
          </div>
        </section>

        ${closingCta(
          "Tell us what you need. We&apos;ll price it.",
          "One form, one specialist, one business day. Quotes for clinics, practices, labs, and care facilities.",
        )}`;

  return {
    title: "GJ Premium | Medical Supply, Quoted in One Business Day",
    description:
      "GJ Premium supplies clinics, practices, labs and care facilities across ten medical supply categories. Request a quote and get pricing, availability and a delivery window within one business day.",
    path: "/",
    content,
    jsonLd: [FAQ_JSON_LD, localBusinessJsonLd()],
  };
}

/** Organization / local business data (was inline in the old index.html). */
function localBusinessJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "GJ Premium",
    description:
      "Medical supply company supplying clinics, practices, laboratories and care facilities across ten product categories, with quotes returned within one business day.",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/pills-heart.jpg`,
    email: "gjpremium14@gmail.com",
    telephone: "+447485206665",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "gjpremium14@gmail.com",
        telephone: "+447485206665",
        availableLanguage: ["English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "08:00",
          closes: "18:00",
        },
      },
    ],
    areaServed: "US",
  };
}
