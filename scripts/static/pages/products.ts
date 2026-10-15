import { PRODUCT_CATEGORIES } from "../../../src/lib/catalog.ts";
import { BTN_PRIMARY_LG, iconArrowRight, iconCheck } from "../ui.ts";
import { CONTAINER, esc, pageBreadcrumbs, type PageInput } from "../site.ts";
import { homeCta } from "./home.ts";

/** `FadeIn` replacement: a short fade + lift, revealed by IntersectionObserver. */
function reveal(className = "", delay = 0): string {
  const style = delay ? ` style="--reveal-delay:${delay}s"` : "";
  return `<div class="reveal${className ? ` ${className}` : ""}"${style}>`;
}

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

const READINESS = [
  "Items, quantities, and any model numbers",
  "Your delivery address or service region",
  "Your needed-by date",
  "A work email for the quote",
];

export function productsPage(): PageInput {
  const rows = PRODUCT_CATEGORIES.map(
    (category, index) => `<li id="${category.slug}" class="scroll-mt-24 grid grid-cols-12 items-start gap-x-4 gap-y-4 border-b border-border py-7 transition-colors hover:bg-muted/40">
                    <span class="col-span-2 text-xs font-semibold tabular-nums tracking-[0.15em] text-muted-foreground md:col-span-1">${String(
                      index + 1,
                    ).padStart(2, "0")}</span>

                    <div class="col-span-10 md:col-span-4 lg:col-span-3">
                      <h3 class="text-base font-medium">${esc(category.name)}</h3>
                      <a href="/quote/?category=${encodeURIComponent(
                        category.name,
                      )}" class="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy transition-colors hover:text-foreground">Request a quote${iconArrowRight(
                        "size-3.5",
                      )}</a>
                    </div>

                    <div class="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
                      <p class="text-sm leading-relaxed text-muted-foreground">${esc(
                        category.description,
                      )}</p>
                      <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        ${category.items
                          .map(
                            (item) =>
                              `<li class="flex items-center gap-2 text-[13px] text-foreground"><span aria-hidden class="h-1 w-1 rounded-full bg-brand-teal"></span>${esc(
                                item,
                              )}</li>`,
                          )
                          .join("")}
                      </ul>
                      ${category.groups?.length
                        ? `<div class="mt-5 border-t border-border pt-4">
                      <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Product lines we stock</p>
                      <ul class="mt-3 space-y-1.5">
                        ${category.groups
                          .map(
                            (group) =>
                              `<li class="text-[13px] leading-relaxed"><span class="font-medium text-foreground">${esc(
                                group.name,
                              )}</span> <span class="text-muted-foreground">&mdash; ${esc(
                                group.variants.join(", "),
                              )}</span></li>`,
                          )
                          .join("")}
                      </ul>
                      <p class="mt-3 text-[13px] text-muted-foreground">Need something outside this list? <a href="/quote/" class="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">Send an enquiry</a> and we&rsquo;ll tell you what we can source.</p>
                    </div>`
                        : ""}
                    </div>
                  </li>`,
  ).join("\n              ");

  const assurances = ASSURANCES.map(
    (item, index) =>
      `${reveal("", index * 0.07)}<div class="border-t border-foreground/20 pt-6">
                    <p class="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">${item.number}</p>
                    <h3 class="mt-4 text-base font-medium">${esc(item.title)}</h3>
                    <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">${esc(
                      item.description,
                    )}</p>
                  </div></div>`,
  ).join("\n            ");

  const readiness = READINESS.map(
    (item) =>
      `<li class="flex items-start gap-3 text-sm text-foreground">${iconCheck(
        "mt-0.5 size-4 shrink-0 text-brand-teal",
      )}${esc(item)}</li>`,
  ).join("\n                  ");

  const content = `        <!-- Page header -->
        <section class="photo-wash border-b border-border">
          <div class="${CONTAINER} grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
            ${reveal(" lg:col-span-6")}${pageBreadcrumbs(
              [{ label: "Products" }],
              "mb-7",
            )}
              <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Products</p>
              <h1 class="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">A total assortment,<br />quoted in one place.</h1>
            </div>

            ${reveal(
              " lg:col-span-5 lg:col-start-8",
              0.1,
            )}<div class="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>GJ Premium supplies care settings across ten product categories, from wound care to the operating room. Whatever the mix, it goes on one request: items, quantities, delivery location, and timing.</p>
                <p>A supply specialist replies with pricing, availability, and a delivery window within one business day.</p>
              </div>
              <div class="mt-7">
                <a href="/quote/" class="${BTN_PRIMARY_LG}">Request a quote${iconArrowRight(
                  "size-4",
                )}</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Categories -->
        <section id="categories" class="scroll-mt-16">
          <div class="${CONTAINER} py-20 md:py-28">
            ${reveal()}<div class="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div class="lg:col-span-7">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">The assortment</p>
                  <h2 class="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Ten categories, described in plain language.</h2>
                </div>
                <p class="text-base leading-relaxed text-muted-foreground lg:col-span-5">Supplier catalogues name things differently. These are the categories we stock under, with the line items facilities ask us for most. If your list crosses several of them, or none of them neatly, send it anyway.</p>
            </div></div>

            ${reveal(" mt-12", 0.1)}<ul class="border-t border-border">
                ${rows}
              </ul>
            </div>
          </div>
        </section>

        <!-- What you can count on -->
        <section class="border-y border-border bg-muted/40">
          <div class="${CONTAINER} py-20 md:py-28">
            ${reveal()}<p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">What you can count on</p>
              <div class="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
                <h2 class="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:col-span-7">Supply that behaves the same way on every order.</h2>
                <p class="text-base leading-relaxed text-muted-foreground lg:col-span-5">Products matter, and so does everything around them: the paperwork, the pack sizes, and the person you call.</p>
              </div>
            </div>

            <div class="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
              ${assurances}
            </div>
          </div>
        </section>

        <!-- Not sure where it fits -->
        <section class="${CONTAINER} py-20 md:py-28">
          ${reveal()}<div class="grid gap-8 border border-border p-7 md:grid-cols-2 md:p-10">
              <div class="flex flex-col justify-between gap-6">
                <div>
                  <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Not sure where it fits?</p>
                  <h3 class="mt-4 text-xl font-semibold tracking-tight md:text-2xl">Send the list anyway.</h3>
                  <p class="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">Product names vary between suppliers and catalogues. Tell us what you need in your own words, we sort the items into the right categories and quote them together, including equivalents where a line has been discontinued.</p>
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
                  ${readiness}
                </ul>
              </div>
          </div></div>
        </section>

        ${homeCta(
          "Ten categories. One form. One business day.",
          "Quotes for clinics, practices, labs, and care facilities, with pricing, availability, and a delivery window in the reply.",
        )}`;

  return {
    title: "Medical supply product categories | GJ Premium",
    description:
      "Ten medical supply categories from GJ Premium: wound care, diabetes care, infusion, nutrition, continence, nursing, personal care, protection and surgical, with typical line items and one quote form.",
    path: "/products",
    content,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://gjpremium.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: "https://gjpremium.com/products",
          },
        ],
      },
    ],
  };
}
