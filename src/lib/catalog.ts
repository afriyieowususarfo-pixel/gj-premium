/**
 * The GJ Premium assortment — the single source of truth for product
 * categories, shared by the landing page, the products page and the
 * quote form so the lists can never drift apart.
 */
export type ProductCategory = {
  slug: string;
  name: string;
  description: string;
  /** Typical line items a facility asks us to quote. */
  items: string[];
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: "wound-care",
    name: "Wound care",
    description:
      "Primary and advanced dressings for acute and chronic wounds, plus the tapes, bandages and antiseptics that go with them.",
    items: [
      "Foam, alginate & hydrocolloid dressings",
      "Gauze and swabs",
      "Tapes and fixation",
      "Bandages and compression",
      "Antiseptics and cleansers",
    ],
  },
  {
    slug: "diabetes-care",
    name: "Diabetes care",
    description:
      "Everyday consumables for glucose monitoring and insulin delivery, in the pack sizes clinics and pharmacies reorder most.",
    items: [
      "Test strips and lancets",
      "Glucose meters",
      "Pen needles and syringes",
      "Control solution",
      "Sharps disposal",
    ],
  },
  {
    slug: "infusion-vascular-access",
    name: "Infusion & vascular access",
    description:
      "Sets, catheters and accessories for starting and maintaining intravenous therapy, from single IVs to recurring infusions.",
    items: [
      "IV giving sets",
      "Peripheral cannulas",
      "Catheters and securement",
      "Extension and tubing sets",
      "Infusion accessories",
    ],
  },
  {
    slug: "medical-nutrition",
    name: "Medical nutrition",
    description:
      "Enteral formulas, oral supplements and the delivery sets needed for clinical nutrition at the bedside or at home.",
    items: [
      "Enteral formulas",
      "Oral nutritional supplements",
      "Feeding sets and pumps",
      "Administration syringes",
      "Flush syringes",
    ],
  },
  {
    slug: "continence-drainage",
    name: "Continence drainage",
    description:
      "Closed drainage for urinary care — catheters, bags and accessories chosen for comfort, safety and length of stay.",
    items: [
      "Urinary catheters",
      "Drainage bags",
      "Leg bags and straps",
      "Catheter care and fixation",
      "Anti-reflux valves",
    ],
  },
  {
    slug: "incontinence-absorbing",
    name: "Incontinence absorbing",
    description:
      "Absorbent products for light through heavy incontinence, sized for hospital, long-term care and home use.",
    items: [
      "Absorbent briefs and pads",
      "Male and female guards",
      "Underpads and bed protection",
      "Belted and belted-style products",
      "Range by absorbency level",
    ],
  },
  {
    slug: "nursing-facilities",
    name: "Nursing & facilities",
    description:
      "The general consumables a nursing station and a care facility go through every shift — measured, bagged, and delivered.",
    items: [
      "Thermometers and diagnostics",
      "Blood pressure cuffs and stethoscopes",
      "Sharps containers and waste bags",
      "Bedpans, bowls and basins",
      "Exam room consumables",
    ],
  },
  {
    slug: "personal-care",
    name: "Personal care",
    description:
      "Hygiene and skin care for daily patient care — gentle cleansers, barrier protection and bathing essentials.",
    items: [
      "Body wash and shampoo",
      "Cleansing wipes",
      "Barrier and moisturising creams",
      "Oral care",
      "Hand hygiene",
    ],
  },
  {
    slug: "personal-protection",
    name: "Personal protection",
    description:
      "PPE for staff and patients, stocked in the case quantities facilities burn through — with fit, grade, and standard checked.",
    items: [
      "Examination and surgical gloves",
      "Gowns and aprons",
      "Masks and respirators",
      "Face shields and eye protection",
      "Hair and shoe covers",
    ],
  },
  {
    slug: "surgical-or",
    name: "Surgical & OR",
    description:
      "Sterile consumables for the operating theatre — drapes, gowns and procedure packs assembled around your list.",
    items: [
      "Sterile drapes and procedure packs",
      "Surgical gowns",
      "Swabs and sponges",
      "Suction and irrigation",
      "Suturing consumables",
    ],
  },
];

/** Category choices offered by the quote form, in the order they are shown. */
export const CATEGORY_OPTIONS: string[] = [
  ...PRODUCT_CATEGORIES.map((category) => category.name),
  "Multiple categories",
  "Not sure yet",
];

/** Link to the quote form with the primary category already selected. */
export function quotePathFor(categoryName: string): string {
  return `/quote?category=${encodeURIComponent(categoryName)}`;
}
