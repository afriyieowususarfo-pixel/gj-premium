import { BTN_PRIMARY_LG, iconArrowRight, iconCheck } from "../ui.ts";
import {
  CONTACT_EMAIL,
  CONTAINER,
  esc,
  pageBreadcrumbs,
  type PageInput,
} from "../site.ts";

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

/**
 * `/thank-you` — the reference number is filled in from `?ref=` by site.js
 * when the form backend supplies one; otherwise the page says the quote is
 * on its way by email.
 */
export function thankYouPage(): PageInput {
  const nextSteps = NEXT_STEPS.map(
    (step) => `<li class="flex gap-4">
                      <span class="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">${step.number}</span>
                      <div>
                        <p class="text-sm font-medium">${esc(step.title)}</p>
                        <p class="mt-1 text-sm leading-relaxed text-muted-foreground">${esc(
                          step.description,
                        )}</p>
                      </div>
                    </li>`,
  ).join("\n                  ");

  const content = `        <!-- Page header -->
        <section class="photo-wash border-b border-border">
          <div class="${CONTAINER} py-14 md:py-16">
            ${pageBreadcrumbs([{ label: "Thank you" }], "mb-7")}
            <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Request received</p>
            <div class="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
              <h1 class="text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:col-span-7">Thank you, we have your list.</h1>
              <p class="text-base leading-relaxed text-muted-foreground lg:col-span-5">Nothing else to do. A supply specialist is already working on it, and your quote arrives by email within one business day.</p>
            </div>
          </div>
        </section>

        <div class="${CONTAINER} grid gap-12 py-14 md:py-16 lg:grid-cols-12 lg:gap-16">
          <div class="lg:col-span-7">
            <div class="border border-border p-7 md:p-10">
              <span class="flex size-11 items-center justify-center rounded-full bg-brand-teal/10">${iconCheck(
                "size-5 text-brand-teal",
              )}</span>

              <h2 class="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">Request received.</h2>
              <p class="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">We have logged your request and a confirmation is on its way. Keep the reference below for your records. It is what we will quote under.</p>

              <dl class="mt-8 border-t border-border text-sm">
                <div class="flex items-baseline justify-between gap-4 border-b border-border py-3.5">
                  <dt class="text-muted-foreground">Your reference</dt>
                  <dd data-reference class="text-right font-semibold tabular-nums">On its way by email</dd>
                </div>
                <div class="flex items-baseline justify-between gap-4 border-b border-border py-3.5">
                  <dt class="text-muted-foreground">Reply by</dt>
                  <dd class="text-right font-medium">Within one business day</dd>
                </div>
              </dl>

              <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href="/products/" class="${BTN_PRIMARY_LG}">Browse the assortment${iconArrowRight(
                  "size-4",
                )}</a>
                <a href="/" class="text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">Back to home</a>
              </div>
            </div>
          </div>

          <aside class="lg:col-span-4 lg:col-start-9">
            <div class="lg:sticky lg:top-24 space-y-8">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">What happens next</p>
                <ol class="mt-5 space-y-5">
                  ${nextSteps}
                </ol>
              </div>

              <div class="border-t border-border pt-6">
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Need to add something?</p>
                <div class="mt-3 space-y-1 text-sm">
                  <p>
                    <a href="mailto:${CONTACT_EMAIL}" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">${CONTACT_EMAIL}</a>
                  </p>
                  <p class="text-muted-foreground">Reply to your confirmation email, or send the additions with your reference number.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>`;

  return {
    title: "Thank you, request received | GJ Premium",
    description:
      "Your quote request has been received. A supply specialist will reply with pricing, availability and a delivery window within one business day.",
    path: "/thank-you",
    content,
    noindex: true,
  };
}

const SUGGESTIONS = [
  { label: "All ten product categories", to: "/products/" },
  { label: "Request a quote", to: "/quote/" },
  { label: "How the quote process works", to: "/#process" },
  { label: "Frequently asked questions", to: "/#faq" },
  { label: "Privacy policy", to: "/privacy/" },
];

export function notFoundPage(): PageInput {
  const suggestions = SUGGESTIONS.map(
    (link) => `<li>
                      <a href="${link.to}" class="flex items-center justify-between gap-4 px-6 py-4 text-sm transition-colors hover:bg-muted/60">${esc(
                        link.label,
                      )}${iconArrowRight(
                        "size-4 shrink-0 text-muted-foreground",
                      )}</a>
                    </li>`,
  ).join("\n                  ");

  const content = `        <section class="border-b border-border">
          <div class="${CONTAINER} grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
            <div class="lg:col-span-6">
              <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Error 404</p>
              <h1 class="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">Page not found.</h1>
              <p class="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">The page you asked for doesn&apos;t exist. It may have been moved, or the link may be mistyped. Everything on this site is one click away below.</p>
              <div class="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a href="/" class="${BTN_PRIMARY_LG}">Back to home${iconArrowRight(
                  "size-4",
                )}</a>
                <a href="/quote/" class="text-[15px] font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-foreground">Request a quote</a>
              </div>
            </div>

            <div class="lg:col-span-5 lg:col-start-8">
              <div class="border border-border">
                <p class="border-b border-border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Or go straight to</p>
                <ul class="divide-y divide-border">
                  ${suggestions}
                </ul>
              </div>
            </div>
          </div>
        </section>`;

  return {
    title: "Page not found | GJ Premium",
    description:
      "That page doesn't exist. Browse the ten product categories, request a quote, or head back to the home page.",
    path: "/404",
    content,
    noindex: true,
  };
}
