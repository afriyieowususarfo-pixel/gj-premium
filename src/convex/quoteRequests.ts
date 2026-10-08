import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Least-privilege input bounds for the public endpoint. Caps are far above
 * anything the quote form produces, but stop a direct API caller from
 * storing megabyte-scale documents in the database.
 */
const MAX_LENGTHS = {
  fullName: 200,
  organization: 200,
  email: 254,
  phone: 50,
  facilityType: 100,
  category: 100,
  items: 5000,
  neededBy: 100,
  location: 500,
  notes: 5000,
} as const;

function assertMax(label: string, value: string | undefined, max: number) {
  if (value !== undefined && value.length > max) {
    throw new Error(`${label} is too long (max ${max} characters).`);
  }
}

/**
 * Public quote-request submission. No account required: the site's whole
 * v1 flow funnels here.
 */
export const submit = mutation({
  args: {
    fullName: v.string(),
    organization: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    facilityType: v.string(),
    category: v.string(),
    items: v.string(),
    neededBy: v.string(),
    location: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fullName = args.fullName.trim();
    const organization = args.organization.trim();
    const email = args.email.trim().toLowerCase();
    const phone = args.phone?.trim();
    const facilityType = args.facilityType.trim();
    const category = args.category.trim();
    const items = args.items.trim();
    const neededBy = args.neededBy.trim();
    const location = args.location.trim();
    const notes = args.notes?.trim();

    if (fullName.length < 2) throw new Error("A full name is required.");
    if (organization.length === 0) throw new Error("An organization is required.");
    if (!EMAIL_PATTERN.test(email)) throw new Error("A valid email is required.");
    if (facilityType.length === 0) throw new Error("A facility type is required.");
    if (category.length === 0) throw new Error("A category is required.");
    if (items.length === 0) throw new Error("Requested items are required.");
    if (neededBy.length === 0) throw new Error("A needed-by timeframe is required.");
    if (location.length === 0) throw new Error("A delivery location is required.");

    assertMax("Full name", fullName, MAX_LENGTHS.fullName);
    assertMax("Organization", organization, MAX_LENGTHS.organization);
    assertMax("Email", email, MAX_LENGTHS.email);
    assertMax("Phone", phone, MAX_LENGTHS.phone);
    assertMax("Facility type", facilityType, MAX_LENGTHS.facilityType);
    assertMax("Category", category, MAX_LENGTHS.category);
    assertMax("Items", items, MAX_LENGTHS.items);
    assertMax("Needed-by", neededBy, MAX_LENGTHS.neededBy);
    assertMax("Delivery location", location, MAX_LENGTHS.location);
    assertMax("Notes", notes, MAX_LENGTHS.notes);

    const id = await ctx.db.insert("quoteRequests", {
      fullName,
      organization,
      email,
      phone: phone || undefined,
      facilityType,
      category,
      items,
      neededBy,
      location,
      notes: notes || undefined,
      status: "new",
      createdAt: Date.now(),
    });

    const reference = `GJ-P-${id.slice(-6).toUpperCase()}`;

    // Best-effort confirmation email: runs after this transaction commits,
    // so the quote is stored even if delivery fails (see quoteEmails.ts).
    await ctx.scheduler.runAfter(
      0,
      internal.quoteEmails.sendQuoteConfirmation,
      { to: email, fullName, organization, reference },
    );

    return { id, reference };
  },
});
