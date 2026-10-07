import { BrandLogo } from "@/components/BrandLogo";
import { PRODUCT_CATEGORIES } from "@/lib/catalog";
import type { ReactNode } from "react";
import { Link } from "react-router";

const SITE_LINKS = [
  { label: "Overview", to: "/#overview" },
  { label: "Products", to: "/products" },
  { label: "FAQ", to: "/#faq" },
  { label: "Case studies", to: "/#cases" },
  { label: "Quote process", to: "/#process" },
];

const QUOTE_LINKS = [
  { label: "Request a quote", to: "/quote" },
  { label: "What to include", to: "/quote#checklist" },
];

const CONTACT_LINKS = [
  { label: "gjpremium14@gmail.com", href: "mailto:gjpremium14@gmail.com" },
  { label: "+44 7485 206665", href: "tel:+447485206665" },
  { label: "Mon–Fri, 8:00–18:00 ET", href: undefined },
];

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {heading}
      </h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 pt-14 pb-28 md:pb-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandLogo orientation="stacked" tagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Medical supply partner to clinics, practices, labs, and care
              facilities. Quality products, careful fulfillment, one clear
              quote.
            </p>
          </div>

          <div className="grid gap-10 md:col-span-6 md:col-start-7 md:grid-cols-2 lg:grid-cols-3">
            <FooterColumn heading="Site">
              {SITE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn heading="Quotes">
              {QUOTE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn heading="Contact">
              {CONTACT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-7">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Assortment
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
            {PRODUCT_CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/products#${category.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} GJ Premium. All rights reserved.</span>
            <Link
              to="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy policy
            </Link>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
            Quality · Care · Supply
          </p>
        </div>
      </div>
    </footer>
  );
}
