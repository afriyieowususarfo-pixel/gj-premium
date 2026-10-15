import { CATEGORY_OPTIONS } from "../../../src/lib/catalog.ts";
import {
  BTN_PRIMARY_LG,
  ERROR_CLS,
  INPUT_CLS,
  LABEL_CLS,
  SELECT_CLS,
  TEXTAREA_CLS,
  iconArrowRight,
  iconCheck,
  iconChevronDown,
  iconLoader,
} from "../ui.ts";
import {
  CONTACT_EMAIL,
  CONTAINER,
  esc,
  pageBreadcrumbs,
  type PageInput,
} from "../site.ts";

const FACILITY_TYPES = [
  "Hospital",
  "Clinic / medical practice",
  "Long-term care",
  "Laboratory",
  "Pharmacy",
  "Dental practice",
  "Other",
];

const NEEDED_BY = [
  "ASAP (within 48 hours)",
  "Within 1 week",
  "Within 2 weeks",
  "Within 30 days",
  "Planning ahead",
];

const CHECKLIST = [
  "Items, quantities, and any model numbers",
  "Your delivery address or service region",
  "Your needed-by date",
  "A work email for the quote",
];

const NEXT_STEPS = [
  {
    number: "01",
    title: "We review your request",
    description: "Availability, pack sizes, and alternatives for your facility.",
  },
  {
    number: "02",
    title: "Quote in your inbox",
    description: "Pricing and a delivery window, within one business day.",
  },
  {
    number: "03",
    title: "You approve",
    description: "Reply to confirm, and we schedule fulfillment.",
  },
];

function fieldError(id: string): string {
  return `<p data-error-for="${id}" role="alert" class="${ERROR_CLS}" hidden></p>`;
}

function textField({
  id,
  label,
  required = false,
  type = "text",
  autocomplete,
  placeholder,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  autocomplete: string;
  placeholder: string;
  className?: string;
}): string {
  const marker = required
    ? `<span aria-hidden class="ml-1 text-destructive">*</span>`
    : "";
  return `<div${className ? ` class="${className}"` : ""}>
                    <label for="${id}" class="${LABEL_CLS}">${label}${marker}</label>
                    <input id="${id}" name="${id}" type="${type}" class="${INPUT_CLS}" autocomplete="${autocomplete}" placeholder="${esc(
                      placeholder,
                    )}" aria-invalid="false" />
                    ${fieldError(id)}
                  </div>`;
}

function selectField({
  id,
  label,
  required = false,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  required?: boolean;
  placeholder: string;
  options: string[];
}): string {
  const marker = required
    ? `<span aria-hidden class="ml-1 text-destructive">*</span>`
    : "";
  const items = options
    .map((option) => `<option value="${esc(option)}">${esc(option)}</option>`)
    .join("\n                        ");
  return `<div>
                    <label for="${id}" class="${LABEL_CLS}">${label}${marker}</label>
                    <div class="relative">
                      <select id="${id}" name="${id}" class="${SELECT_CLS}" data-empty="true" aria-invalid="false">
                        <option value="" disabled selected>${esc(
                          placeholder,
                        )}</option>
                        ${items}
                      </select>
                      <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">${iconChevronDown(
                        "size-4 opacity-50",
                      )}</span>
                    </div>
                    ${fieldError(id)}
                  </div>`;
}

function formSection({
  number,
  title,
  hint,
  children,
}: {
  number: string;
  title: string;
  hint: string;
  children: string;
}): string {
  return `<section class="border-t border-border pt-9 first:border-t-0 first:pt-0">
              <div class="flex items-baseline gap-4">
                <span class="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">${number}</span>
                <div>
                  <h2 class="text-[15px] font-medium">${title}</h2>
                  <p class="mt-1 text-sm text-muted-foreground">${esc(hint)}</p>
                </div>
              </div>
              <div class="mt-6 grid gap-5 sm:grid-cols-2">
                ${children}
              </div>
            </section>`;
}

export function quotePage(): PageInput {
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

  const checklist = CHECKLIST.map(
    (item) =>
      `<li class="flex items-start gap-3 text-sm text-foreground">${iconCheck(
        "mt-0.5 size-4 shrink-0 text-brand-teal",
      )}${esc(item)}</li>`,
  ).join("\n                    ");

  const contact = `<p>
                    <a href="mailto:${CONTACT_EMAIL}" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">${CONTACT_EMAIL}</a>
                  </p>
                  <p>
                    <a href="tel:+447485206665" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">+44 7485 206665</a>
                  </p>
                  <p class="text-muted-foreground">Mon&ndash;Fri, 8:00&ndash;18:00 ET</p>`;

  const content = `        <!-- Page header -->
        <section class="photo-wash border-b border-border">
          <div class="${CONTAINER} py-14 md:py-16">
            ${pageBreadcrumbs([{ label: "Request a quote" }], "mb-7")}
            <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Request a quote</p>
            <div class="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
              <h1 class="text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:col-span-7">Tell us what you need.</h1>
              <p class="text-base leading-relaxed text-muted-foreground lg:col-span-5">One short form, no account required. A supply specialist replies with pricing, availability, and delivery timing within one business day.</p>
            </div>
          </div>
        </section>

        <div class="${CONTAINER} grid gap-12 py-14 md:py-16 lg:grid-cols-12 lg:gap-16">
          <!-- Form -->
          <div class="lg:col-span-7">
            <form data-quote-form novalidate action="mailto:${CONTACT_EMAIL}" method="post" enctype="text/plain" class="space-y-9">
              ${formSection({
                number: "01",
                title: "Contact",
                hint: "Who should the quote be addressed to?",
                children: [
                  textField({
                    id: "fullName",
                    label: "Full name",
                    required: true,
                    autocomplete: "name",
                    placeholder: "Jordan Ellis",
                  }),
                  textField({
                    id: "email",
                    label: "Work email",
                    required: true,
                    type: "email",
                    autocomplete: "email",
                    placeholder: "name@facility.com",
                  }),
                  textField({
                    id: "phone",
                    label: "Phone",
                    autocomplete: "tel",
                    placeholder: "Optional: for delivery coordination",
                    className: "sm:col-span-2",
                  }),
                ].join("\n                  "),
              })}

              ${formSection({
                number: "02",
                title: "Your facility",
                hint: "This helps us match pack sizes and compliance standards.",
                children: [
                  textField({
                    id: "organization",
                    label: "Organization / facility",
                    required: true,
                    autocomplete: "organization",
                    placeholder: "e.g. Hillside Family Clinic",
                    className: "sm:col-span-2",
                  }),
                  selectField({
                    id: "facilityType",
                    label: "Facility type",
                    required: true,
                    placeholder: "Select facility type",
                    options: FACILITY_TYPES,
                  }),
                  selectField({
                    id: "category",
                    label: "Primary category",
                    required: true,
                    placeholder: "Select category",
                    options: CATEGORY_OPTIONS,
                  }),
                ].join("\n                  "),
              })}

              ${formSection({
                number: "03",
                title: "What you need",
                hint: "List items and quantities: model numbers help, but aren't required.",
                children: `<div class="sm:col-span-2">
                    <label for="items" class="${LABEL_CLS}">Items &amp; quantities<span aria-hidden class="ml-1 text-destructive">*</span></label>
                    <textarea id="items" name="items" class="${TEXTAREA_CLS}" placeholder="Nitrile exam gloves, medium: 20 boxes&#10;Fluid-resistant gowns: 50 units" aria-invalid="false"></textarea>
                    ${fieldError("items")}
                  </div>
                  ${selectField({
                    id: "neededBy",
                    label: "Needed by",
                    required: true,
                    placeholder: "Select timeframe",
                    options: NEEDED_BY,
                  })}`,
              })}

              ${formSection({
                number: "04",
                title: "Delivery",
                hint: "Where should fulfillment go?",
                children: [
                  textField({
                    id: "location",
                    label: "City / region",
                    required: true,
                    autocomplete: "address-level2",
                    placeholder: "e.g. Columbus, OH",
                  }),
                  textField({
                    id: "notes",
                    label: "Notes",
                    autocomplete: "off",
                    placeholder: "Optional: brands, billing, standards",
                  }),
                ].join("\n                  "),
              })}

              <div data-submit-error role="alert" class="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive" hidden></div>

              <div class="border-t border-border pt-7">
                <button type="submit" data-submit class="${BTN_PRIMARY_LG}">
                  <span data-submit-idle>Submit request${iconArrowRight(
                    "size-4",
                  )}</span>
                  <span data-submit-busy class="hidden">${iconLoader(
                    "size-4",
                  )}Sending&hellip;</span>
                </button>
                <p class="mt-4 text-xs leading-relaxed text-muted-foreground">We only use your details to prepare your quote. No account, no mailing list. See our <a href="/privacy/" class="underline decoration-border underline-offset-4 transition-colors hover:text-foreground">privacy policy</a>.</p>
              </div>
            </form>
          </div>

          <!-- Aside -->
          <aside class="lg:col-span-4 lg:col-start-9">
            <div class="lg:sticky lg:top-24 lg:space-y-8">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">What happens next</p>
                <ol class="mt-5 space-y-5">
                  ${nextSteps}
                </ol>
              </div>

              <div id="checklist" class="scroll-mt-24 border border-border p-6">
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">For the fastest quote</p>
                <ul class="mt-4 space-y-3">
                  ${checklist}
                </ul>
              </div>

              <div class="border-t border-border pt-6">
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Prefer to talk</p>
                <div class="mt-3 space-y-1 text-sm">
                  ${contact}
                </div>
              </div>

              <div class="border-t border-border pt-6">
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Need something we don&rsquo;t stock yet?</p>
                <p class="mt-3 text-sm leading-relaxed text-foreground">If the product you need isn&rsquo;t in our assortment, send the enquiry anyway: pick &ldquo;Something else: request a product we don&rsquo;t stock yet&rdquo; as your primary category and name the product, size, and quantity in the notes. A supply specialist replies within one business day with availability, a suitable alternative, or a clear reason we can&rsquo;t supply it.</p>
                <p class="mt-3 text-sm text-muted-foreground">No product is too small or too specific to ask about.</p>
              </div>
            </div>
          </aside>
        </div>`;

  return {
    title: "Request a quote | GJ Premium",
    description:
      "One short form for clinics, practices, labs and care facilities: items, quantities, delivery location and timing. Pricing, availability and a delivery window back within one business day.",
    path: "/quote",
    content,
    hideMobileCta: true,
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
            name: "Request a quote",
            item: "https://gjpremium.com/quote",
          },
        ],
      },
    ],
  };
}
