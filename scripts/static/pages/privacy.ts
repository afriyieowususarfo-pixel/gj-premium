import { CONTAINER, esc, pageBreadcrumbs, type PageInput } from "../site.ts";

type Section = {
  id: string;
  number: string;
  title: string;
  body: string;
};

const P = (text: string) => `<p>${text}</p>`;

const SECTIONS: Section[] = [
  {
    id: "collect",
    number: "01",
    title: "Information we collect",
    body: `${P(
      "We only collect what you choose to give us. When you submit a quote request, that includes:",
    )}
        <dl class="mt-5 border-t border-border">
          ${[
            {
              term: "Contact details",
              detail:
                "Your name, organization or facility name, work email, and optionally a phone number.",
            },
            {
              term: "Facility details",
              detail:
                "Your facility type and primary product category.",
            },
            {
              term: "Quote details",
              detail:
                "The items and quantities you request, your needed-by timeframe, delivery city or region, and any notes you add.",
            },
            {
              term: "Technical logs",
              detail:
                "Standard connection information such as IP address, browser type, and timestamps, recorded by our hosting provider for security and debugging.",
            },
          ]
            .map(
              (item) => `<div class="grid gap-1 border-b border-border py-4 sm:grid-cols-12 sm:gap-6">
              <dt class="text-sm font-medium sm:col-span-4">${esc(
                item.term,
              )}</dt>
              <dd class="text-sm leading-relaxed text-muted-foreground sm:col-span-8">${esc(
                item.detail,
              )}</dd>
            </div>`,
            )
            .join("\n          ")}
        </dl>`,
  },
  {
    id: "use",
    number: "02",
    title: "How we use it",
    body: `${P("We use your information to:")}
        <ul class="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-border">
          <li>prepare and deliver the quote you requested;</li>
          <li>contact you about that request: clarifying items, confirming availability, and scheduling fulfillment;</li>
          <li>keep the site secure and improve how it works.</li>
          <li>We do not use your details for marketing. Submitting a quote never signs you up for a mailing list.</li>
        </ul>`,
  },
  {
    id: "store",
    number: "03",
    title: "How we store and protect it",
    body: P(
      "Quote requests are stored in our database, operated by our hosting provider Convex. Data is encrypted in transit (HTTPS) and at rest, and access is limited to the GJ Premium team members who handle quotes. We review that access regularly and do not let third parties use the database for their own purposes.",
    ),
  },
  {
    id: "sharing",
    number: "04",
    title: "Sharing and disclosure",
    body: P(
      "We do not sell your personal information. We share it only with service providers who help us run this website and deliver quotes (such as our hosting and database provider), or where required by law, for example, a valid legal request.",
    ),
  },
  {
    id: "cookies",
    number: "05",
    title: "Cookies and tracking",
    body: P(
      "This site does not use advertising cookies, tracking pixels, or third-party analytics scripts. Any storage the site uses is strictly necessary for the site to function.",
    ),
  },
  {
    id: "retention",
    number: "06",
    title: "Retention",
    body: P(
      "We keep quote request details for as long as we need them to handle your request and maintain ordinary business records. After that, we delete or anonymize them. You can ask us to delete yours at any time.",
    ),
  },
  {
    id: "rights",
    number: "07",
    title: "Your rights and choices",
    body: `${P("You can ask us to:")}
        <ul class="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-border">
          <li>give you a copy of the information we hold about you;</li>
          <li>correct anything that is inaccurate;</li>
          <li>delete your information, or restrict how we use it;</li>
          <li>stop contacting you about a request.</li>
        </ul>
        <p class="mt-4">To exercise any of these, email <a href="mailto:gjpremium14@gmail.com" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">gjpremium14@gmail.com</a>. We respond within 30 days, and sooner where local law requires it.</p>`,
  },
  {
    id: "third-parties",
    number: "08",
    title: "Third-party services",
    body: P(
      "This site is hosted with Convex (database and backend) and loads its typeface from Google Fonts. Each processes data under its own privacy policy; we choose providers carefully and only for what the site needs.",
    ),
  },
  {
    id: "changes",
    number: "09",
    title: "Changes to this policy",
    body: P(
      "We may update this policy as the site or the law changes. The current version always appears on this page with its effective date at the top. Material changes will be posted here before they take effect.",
    ),
  },
];

export function privacyPage(): PageInput {
  const contents = SECTIONS.map(
    (section) => `<li class="border-b border-border">
                    <a href="#${section.id}" class="flex items-baseline gap-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <span class="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">${section.number}</span>
                      ${esc(section.title)}
                    </a>
                  </li>`,
  ).join("\n                  ");

  const bodies = SECTIONS.map(
    (section) => `<section id="${section.id}" class="scroll-mt-20">
                  <div class="flex items-baseline gap-4 border-b border-border pb-4">
                    <span class="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">${section.number}</span>
                    <h2 class="text-xl font-semibold tracking-tight md:text-2xl">${esc(
                      section.title,
                    )}</h2>
                  </div>
                  <div class="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                    ${section.body}
                  </div>
                </section>`,
  ).join("\n\n              ");

  const content = `        <section class="border-b border-border">
          <div class="${CONTAINER} py-14 md:py-16">
            ${pageBreadcrumbs([{ label: "Privacy policy" }], "mb-7")}
            <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">Legal</p>
            <div class="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
              <h1 class="text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:col-span-7">Privacy policy</h1>
              <p class="text-sm leading-relaxed text-muted-foreground lg:col-span-5">Effective October 4, 2026. This policy explains what we collect on this website, why we collect it, and the choices you have.</p>
            </div>
          </div>
        </section>

        <div class="${CONTAINER} py-14 md:py-16">
          <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <nav aria-label="Contents" class="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
              <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Contents</p>
              <ol class="mt-4 border-t border-border">
                  ${contents}
              </ol>
            </nav>

            <div class="space-y-12 lg:col-span-8 lg:col-start-5">
              ${bodies}

              <div class="border border-border p-7 md:p-8">
                <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Questions about your data</p>
                <div class="mt-4 space-y-1.5 text-sm">
                  <p>
                    <a href="mailto:gjpremium14@gmail.com" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">gjpremium14@gmail.com</a>
                  </p>
                  <p>
                    <a href="tel:+447485206665" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">+44 7485 206665</a>
                  </p>
                  <p class="text-muted-foreground">Mon&ndash;Fri, 8:00&ndash;18:00 ET</p>
                </div>
                <p class="mt-5 text-sm text-muted-foreground">Prefer to request a quote first? <a href="/quote/" class="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">Open the quote form</a>.</p>
              </div>
            </div>
          </div>
        </div>`;

  return {
    title: "Privacy policy | GJ Premium",
    description:
      "How GJ Premium collects, uses and retains the details you send through the quote form, what we never do with them, and the choices you have.",
    path: "/privacy",
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
            name: "Privacy policy",
            item: "https://gjpremium.com/privacy",
          },
        ],
      },
    ],
  };
}
