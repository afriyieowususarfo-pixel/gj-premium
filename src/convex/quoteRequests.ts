import { v } from "convex/values";
import { mutation } from "./_generated/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public quote-request submission. No account required — the site's whole
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

    return await ctx.db.insert("quoteRequests", {
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
  },
});
