import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { CATEGORY_OPTIONS } from "@/lib/catalog";
import { breadcrumbJsonLd, usePageSeo } from "@/lib/seo";
import { useMutation } from "convex/react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

const FACILITY_TYPES = [
  "Hospital",
  "Clinic / medical practice",
  "Long-term care",
  "Laboratory",
  "Pharmacy",
  "Dental practice",
  "Other",
];

// Ten product categories plus the catch-alls, kept in sync with the site.
const CATEGORIES = CATEGORY_OPTIONS;

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

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  facilityType: string;
  category: string;
  items: string;
  neededBy: string;
  location: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  facilityType: "",
  category: "",
  items: "",
  neededBy: "",
  location: "",
  notes: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.fullName.trim().length < 2)
    errors.fullName = "Enter your full name.";
  if (!EMAIL_PATTERN.test(form.email.trim()))
    errors.email = "Enter a valid work email.";
  if (!form.organization.trim())
    errors.organization = "Enter your organization or facility name.";
  if (!form.facilityType) errors.facilityType = "Select your facility type.";
  if (!form.category) errors.category = "Select a category.";
  if (!form.items.trim())
    errors.items = "Tell us which items and quantities you need.";
  if (!form.neededBy) errors.neededBy = "Select when you need delivery.";
  if (!form.location.trim()) errors.location = "Where should we deliver?";
  return errors;
}

function Field({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function FormSection({
  number,
  title,
  hint,
  children,
}: {
  number: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-9 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-4">
        <span className="text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-navy">
          {number}
        </span>
        <div>
          <h2 className="text-[15px] font-medium">{title}</h2>
          {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function SelectField({
  id,
  label,
  required,
  error,
  value,
  placeholder,
  options,
  onChange,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Field
      id={id}
      label={label}
      required={required}
      error={error}
      className={className}
    >
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-10 w-full" aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export default function Quote() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submitQuote = useMutation(api.quoteRequests.submit);

  usePageSeo({
    title: "Request a quote | GJ Premium",
    description:
      "One short form for clinics, practices, labs and care facilities: items, quantities, delivery location and timing. Pricing, availability and a delivery window back within one business day.",
    path: "/quote",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Request a quote", path: "/quote" },
      ]),
    ],
  });

  // Arriving from a category link (/quote?category=Wound%20care) preselects it.
  const [form, setForm] = useState<FormState>(() => {
    const requested = searchParams.get("category");
    return requested && CATEGORIES.includes(requested)
      ? { ...EMPTY_FORM, category: requested }
      : EMPTY_FORM;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Honor hashes such as /quote#checklist from footer links.
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

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstInvalid = Object.keys(validationErrors)[0];
      document
        .getElementById(firstInvalid)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { reference } = await submitQuote({
        fullName: form.fullName.trim(),
        organization: form.organization.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        facilityType: form.facilityType,
        category: form.category,
        items: form.items.trim(),
        neededBy: form.neededBy,
        location: form.location.trim(),
        notes: form.notes.trim() || undefined,
      });
      // The thank-you page carries the reference, so the form resets cleanly.
      navigate(`/thank-you?ref=${encodeURIComponent(reference)}`);
    } catch {
      setSubmitError(
        "We couldn't send your request. Please try again, or email quotes@gjpremium.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* ── Page header ──────────────────────────────────────── */}
        <section className="photo-wash border-b border-border">
          <div className={`${CONTAINER} py-14 md:py-16`}>
            <Breadcrumbs
              items={[{ label: "Request a quote" }]}
              className="mb-7"
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-navy">
              Request a quote
            </p>
            <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:col-span-7">
                Tell us what you need.
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5">
                One short form, no account required. A supply specialist
                replies with pricing, availability, and delivery timing within
                one business day.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`${CONTAINER} grid gap-12 py-14 md:py-16 lg:grid-cols-12 lg:gap-16`}
        >
          {/* ── Form ─────────────────────────── */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} noValidate className="space-y-9">
                <FormSection
                  number="01"
                  title="Contact"
                  hint="Who should the quote be addressed to?"
                >
                  <Field
                    id="fullName"
                    label="Full name"
                    required
                    error={errors.fullName}
                  >
                    <Input
                      id="fullName"
                      className="h-10"
                      autoComplete="name"
                      placeholder="Jordan Ellis"
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      aria-invalid={!!errors.fullName}
                    />
                  </Field>
                  <Field
                    id="email"
                    label="Work email"
                    required
                    error={errors.email}
                  >
                    <Input
                      id="email"
                      type="email"
                      className="h-10"
                      autoComplete="email"
                      placeholder="name@facility.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                  <Field
                    id="phone"
                    label="Phone"
                    error={errors.phone}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="phone"
                      type="tel"
                      className="h-10"
                      autoComplete="tel"
                      placeholder="Optional: for delivery coordination"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </Field>
                </FormSection>

                <FormSection
                  number="02"
                  title="Your facility"
                  hint="This helps us match pack sizes and compliance standards."
                >
                  <Field
                    id="organization"
                    label="Organization / facility"
                    required
                    error={errors.organization}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="organization"
                      className="h-10"
                      autoComplete="organization"
                      placeholder="e.g. Hillside Family Clinic"
                      value={form.organization}
                      onChange={(e) => set("organization", e.target.value)}
                      aria-invalid={!!errors.organization}
                    />
                  </Field>
                  <SelectField
                    id="facilityType"
                    label="Facility type"
                    required
                    error={errors.facilityType}
                    value={form.facilityType}
                    placeholder="Select facility type"
                    options={FACILITY_TYPES}
                    onChange={(value) => set("facilityType", value)}
                  />
                  <SelectField
                    id="category"
                    label="Primary category"
                    required
                    error={errors.category}
                    value={form.category}
                    placeholder="Select category"
                    options={CATEGORIES}
                    onChange={(value) => set("category", value)}
                  />
                </FormSection>

                <FormSection
                  number="03"
                  title="What you need"
                  hint="List items and quantities: model numbers help, but aren't required."
                >
                  <Field
                    id="items"
                    label="Items & quantities"
                    required
                    error={errors.items}
                    className="sm:col-span-2"
                  >
                    <Textarea
                      id="items"
                      className="min-h-32"
                      placeholder={
                        "Nitrile exam gloves, medium: 20 boxes\nFluid-resistant gowns: 50 units"
                      }
                      value={form.items}
                      onChange={(e) => set("items", e.target.value)}
                      aria-invalid={!!errors.items}
                    />
                  </Field>
                  <SelectField
                    id="neededBy"
                    label="Needed by"
                    required
                    error={errors.neededBy}
                    value={form.neededBy}
                    placeholder="Select timeframe"
                    options={NEEDED_BY}
                    onChange={(value) => set("neededBy", value)}
                  />
                </FormSection>

                <FormSection
                  number="04"
                  title="Delivery"
                  hint="Where should fulfillment go?"
                >
                  <Field
                    id="location"
                    label="City / region"
                    required
                    error={errors.location}
                  >
                    <Input
                      id="location"
                      className="h-10"
                      autoComplete="address-level2"
                      placeholder="e.g. Columbus, OH"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      aria-invalid={!!errors.location}
                    />
                  </Field>
                  <Field id="notes" label="Notes" error={errors.notes}>
                    <Input
                      id="notes"
                      className="h-10"
                      placeholder="Optional: brands, billing, standards"
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                    />
                  </Field>
                </FormSection>

                {submitError && (
                  <div
                    role="alert"
                    className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    {submitError}
                  </div>
                )}

                <div className="border-t border-border pt-7">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="rounded-full px-7 text-[15px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Submit request
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    We only use your details to prepare your quote. No account,
                    no mailing list. See our{" "}
                    <Link
                      to="/privacy"
                      className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </div>
              </form>
          </div>

          {/* ── Aside ──────────────────────────────────────────── */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24 lg:space-y-8">
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

              <div
                id="checklist"
                className="scroll-mt-24 border border-border p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  For the fastest quote
                </p>
                <ul className="mt-4 space-y-3">
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

              <div className="border-t border-border pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Prefer to talk
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
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
