/**
 * The GJ Premium assortment: the single source of truth for product
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

/**
 * Product groups are the finer-grained lines we quote from. The same
 * catalog structure feeds the React quote page and the static quote form,
 * so the assortment can never drift between the two builds.
 *
 * slugs are used as stable ids on the products page and in structured
 * quote copy; names are shown to buyers.
 */
export type ProductGroup = {
  slug: string;
  name: string;
  /** Typical pack sizes, gauges, or lengths buyers ask for. */
  variants: string[];
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
    groups: [
      {
        slug: "iv-cannulas",
        name: "I.V cannulas",
        variants: [
          "I.V Cannula 16G",
          "I.V Cannula 18G",
          "I.V Cannula 20G",
          "I.V Cannula 22G",
          "I.V Cannula 24G",
          "I.V Cannula 26G",
        ],
      },
      {
        slug: "nasal-oxygen-cannulas",
        name: "Nasal oxygen cannulas",
        variants: [
          "Nasal Oxygen Cannula – Neonate",
          "Nasal Oxygen Cannula – Kids",
          "Nasal Oxygen Cannula – Adult",
        ],
      },
      {
        slug: "ryles-tubes",
        name: "Ryles tubes",
        variants: [
          "Ryles Tube Size 5",
          "Ryles Tube Size 6",
          "Ryles Tube Size 7",
          "Ryles Tube Size 8",
          "Ryles Tube Size 10",
          "Ryles Tube Size 12",
          "Ryles Tube Size 16",
          "Ryles Tube Size 18",
          "Ryles Tube Size 20",
        ],
      },
      {
        slug: "suction-catheters",
        name: "Suction catheters",
        variants: [
          "Suction Catheter Size 12",
          "Suction Catheter Size 14",
          "Suction Catheter Size 35",
        ],
      },
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
      "Closed drainage for urinary care: catheters, bags and accessories chosen for comfort, safety and length of stay.",
    items: [
      "Urinary catheters",
      "Drainage bags",
      "Leg bags and straps",
      "Catheter care and fixation",
      "Anti-reflux valves",
    ],
    groups: [
      {
        slug: "intermittent-catheters",
        name: "Catheters",
        variants: [
          "Catheter Size 6",
          "Catheter Size 8",
          "Catheter Size 10",
          "Catheter Size 12",
          "Catheter Size 14",
          "Catheter Size 16",
          "Catheter Size 18",
          "Catheter Size 20",
          "Catheter Size 22",
        ],
      },
      {
        slug: "foley-catheters",
        name: "Foley catheters",
        variants: [
          "Foley Catheter 14F",
          "Foley Catheter 16F",
          "Foley Catheter 20F",
          "Foley Catheter 24F",
        ],
      },
      {
        slug: "silicone-catheters",
        name: "Silicone catheters",
        variants: [
          "Silicon Catheter Size 6",
          "Silicon Catheter Size 8",
          "Silicon Catheter Size 10",
          "Silicon Catheter Size 12",
          "Silicon Catheter Size 14",
          "Silicon Catheter Size 16",
          "Silicon Catheter Size 18",
          "Silicon Catheter Size 20",
          "Silicon Catheter Size 22",
        ],
      },
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
      "The general consumables a nursing station and a care facility go through every shift: measured, bagged, and delivered.",
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
      "Hygiene and skin care for daily patient care: gentle cleansers, barrier protection and bathing essentials.",
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
      "PPE for staff and patients, stocked in the case quantities facilities burn through, with fit, grade, and standard checked.",
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
      "Sterile consumables for the operating theatre: drapes, gowns and procedure packs assembled around your list.",
    items: [
      "Sterile drapes and procedure packs",
      "Surgical gowns",
      "Swabs and sponges",
      "Suction and irrigation",
      "Suturing consumables",
    ],
    groups: [
      {
        slug: "cord-clamp",
        name: "Cord clamp",
        variants: ["Cord Clamp"],
      },
    ],
  },
];

/** Category choices offered by the quote form, in the order they are shown. */
export const CATEGORY_OPTIONS: string[] = [
  ...PRODUCT_CATEGORIES.map((category) => category.name),
  "Multiple categories",
  "Not sure yet",
  "Something else: request a product we don’t stock yet",
];

/**
 * All currently hosted product lines, across categories. We use this on the
 * quote page to tell buyers which exact items are available now, and to
 * make the “we don’t have it yet” enquiry path obvious.
 */
export const HOSTED_PRODUCT_LINES: ProductGroup[] = PRODUCT_CATEGORIES
  .filter((category): category is ProductCategory & { groups: ProductGroup[] } =>
    "groups" in category,
  )
  .flatMap((category) =>
    category.groups.map((group) => ({
      categorySlug: category.slug,
      categoryName: category.name,
      ...group,
    })),
  );


/** Link to the quote form with the primary category already selected. */
export function quotePathFor(categoryName: string): string {
  return `/quote?category=${encodeURIComponent(categoryName)}`;
}
