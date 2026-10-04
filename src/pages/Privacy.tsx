import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";

const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

const SECTIONS = [
  {
    id: "collect",
    number: "01",
    title: "Information we collect",
    body: (
      <>
        <p>
          We only collect what you choose to give us. When you submit a quote
          request, that includes:
        </p>
        <dl className="mt-5 border-t border-border">
          {[
            {
              term: "Contact details",
              detail:
                "Your name, organization or facility name, work email, and — optionally — phone number.",
            },
            {
              term: "Facility details",
              detail: "Your facility type and primary product category.",
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
          ].map((item) => (
            <div
              key={item.term}
              className="grid gap-1 border-b border-border py-4 sm:grid-cols-12 sm:gap-6"
            >
              <dt className="text-sm font-medium sm:col-span-4">
                {item.term}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground sm:col-span-8">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </>
    ),
  },
  {
    id: "use",
    number: "02",
    title: "How we use it",
    body: (
      <>
        <p>We use your information to:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-border">
          <li>prepare and deliver the quote you requested;</li>
          <li>
            contact you about that request — clarifying items, confirming
            availability, and scheduling fulfillment;
          </li>
          <li>keep the site secure and improve how it works.</li>
          <li>
            We do not use your details for marketing. Submitting a quote never
            signs you up for a mailing list.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "store",
    number: "03",
    title: "How we store and protect it",
    body: (
      <p>
        Quote requests are stored in our database, operated by our hosting
        provider Convex. Data is encrypted in transit (HTTPS) and at rest, and
        access is limited to the GJ Premium team members who handle quotes. We
        review that access regularly and do not let third parties use the
        database for their own purposes.
      </p>
    ),
  },
  {
    id: "sharing",
    number: "04",
    title: "Sharing and disclosure",
    body: (
      <p>
        We do not sell your personal information. We share it only with service
        providers who help us run this website and deliver quotes (such as our
        hosting and database provider), or where required by law — for example,
        a valid legal request.
      </p>
    ),
  },
  {
    id: "cookies",
    number: "05",
    title: "Cookies and tracking",
    body: (
      <p>
        This site does not use advertising cookies, tracking pixels, or
        third-party analytics scripts. Any storage the site uses is strictly
        necessary for the site to function.
      </p>
    ),
  },
  {
    id: "retention",
    number: "06",
    title: "Retention",
    body: (
      <p>
        We keep quote request details for as long as we need them to handle
        your request and maintain ordinary business records. After that, we
        delete or anonymize them. You can ask us to delete yours at any time.
      </p>
    ),
  },
  {
    id: "rights",
    number: "07",
    title: "Your rights and choices",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-border">
          <li>give you a copy of the information we hold about you;</li>
          <li>correct anything that is inaccurate;</li>
          <li>delete your information, or restrict how we use it;</li>
          <li>stop contacting you about a request.</li>
        </ul>
        <p className="mt-4">
          To exercise any of these, email{" "}
          <a
            href="mailto:quotes@gjpremium.com"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            quotes@gjpremium.com
          </a>
          . We respond within 30 days, and sooner where local law requires it.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    number: "08",
    title: "Third-party services",
    body: (
      <p>
        This site is hosted with Convex (database and backend) and loads its
        typeface from Google Fonts. Each processes data under its own privacy
        policy; we choose providers carefully and only for what the site needs.
      </p>
    ),
  },
  {
    id: "changes",
    number: "09",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as the site or the law changes. The current
        version always appears on this page with its effective date at the top.
        Material changes will be posted here before they take effect.
      </p>
    ),
  },
];

function PageHeader() {
  return (
    <section className="border-b border-border">
      <div className={`${CONTAINER} py-14 md:py-16`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
          Legal
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:col-span-7">
            Privacy policy
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-5">
            Effective October 4, 2026. This policy explains what we collect on
            this website, why we collect it, and the choices you have.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Privacy() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <PageHeader />

        <div className={`${CONTAINER} py-14 md:py-16`}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Contents */}
            <nav
              aria-label="Contents"
              className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Contents
              </p>
              <ol className="mt-4 border-t border-border">
                {SECTIONS.map((section) => (
                  <li key={section.id} className="border-b border-border">
                    <a
                      href={`#${section.id}`}
                      className="flex items-baseline gap-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="text-xs font-semibold tabular-nums tracking-[0.15em] text-brand-navy">
                        {section.number}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Policy sections */}
            <div className="space-y-12 lg:col-span-8 lg:col-start-5">
              {SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20"
                >
                  <div className="flex items-baseline gap-4 border-b border-border pb-4">
                    <span className="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">
                      {section.number}
                    </span>
                    <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                      {section.title}
                    </h2>
                  </div>
                  <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                    {section.body}
                  </div>
                </section>
              ))}

              {/* Contact panel */}
              <div className="border border-border p-7 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Questions about your data
                </p>
                <div className="mt-4 space-y-1.5 text-sm">
                  <p>
                    <a
                      href="mailto:quotes@gjpremium.com"
                      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      quotes@gjpremium.com
                    </a>
                  </p>
                  <p>
                    <a
                      href="tel:+15550142200"
                      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      +1 (555) 014-2200
                    </a>
                  </p>
                  <p className="text-muted-foreground">Mon–Fri, 8:00–18:00 ET</p>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">
                  Prefer to request a quote first?{" "}
                  <Link
                    to="/quote"
                    className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    Open the quote form
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
