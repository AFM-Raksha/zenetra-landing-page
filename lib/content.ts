// Page content and sample data. TestCo is the demo group used across every card.

export const GROUP = "TestCo";
export const ENTITIES = { IND: "TestCo Industries", EXP: "TestCo Exports", RET: "TestCo Retail" } as const;

export type Area = "vendor" | "approval" | "payment" | "group";

export const AREA_LABEL: Record<Area, { short: string; code: string; tone: "v" | "t" | "r" | "b" }> = {
  vendor: { short: "Vendor", code: "VEN", tone: "v" },
  approval: { short: "Approvals", code: "APR", tone: "t" },
  payment: { short: "Payments", code: "PAY", tone: "r" },
  group: { short: "Group", code: "GRP", tone: "b" },
};

/** Flag types shown in the live console, the ledger tooltip and the toast. */
export const FLAG_TYPES = [
  { short: "Duplicate", name: "Duplicate payment", category: "Payment risk" },
  { short: "Diversion", name: "Bank details changed before payment", category: "Payment risk" },
  { short: "Threshold", name: "Spend split under an approval limit", category: "Approval risk" },
  { short: "New vendor", name: "New vendor paid unusually fast", category: "Vendor risk" },
  { short: "Retro PO", name: "Order raised after the invoice", category: "Approval risk" },
  { short: "Dormant", name: "Dormant vendor paid again", category: "Payment risk" },
  { short: "Shared ID", name: "Vendor shares identity with another code", category: "Vendor risk" },
  { short: "Price gap", name: "Higher price at a sister company", category: "Group risk" },
] as const;

export type FlagType = (typeof FLAG_TYPES)[number];

/** Generic fraud typologies. Descriptions explain the scheme, never the detection logic. */
export const PATTERNS: { name: string; area: Area; desc: string; where: string }[] = [
  { name: "Ghost vendors", area: "vendor", desc: "Suppliers that exist only on paper, set up to receive payments for goods or services that were never delivered.", where: "Vendor master, payments" },
  { name: "Employee–vendor conflicts", area: "vendor", desc: "Staff with a hidden interest in a supplier, steering business or payments toward themselves.", where: "Vendor master, HR records" },
  { name: "Duplicate vendor identities", area: "vendor", desc: "One supplier set up under several names or codes, used to split spend or settle the same bill twice.", where: "Vendor masters across entities" },
  { name: "Approval threshold avoidance", area: "approval", desc: "Purchases sized or split so they stay under delegated approval limits and avoid review.", where: "Bills, payments, approval matrix" },
  { name: "Retrospective purchasing", area: "approval", desc: "Orders raised after the goods or the invoice arrived, so the spend was never approved in advance.", where: "Purchase orders, bills, receipts" },
  { name: "Payment without receipt", area: "approval", desc: "Bills settled for goods that cannot be traced to a receipt or a stock movement.", where: "Payments, goods receipts, inventory" },
  { name: "Duplicate payments", area: "payment", desc: "The same obligation paid more than once, by error or by design.", where: "Payments, supplier invoices" },
  { name: "Payment diversion", area: "payment", desc: "Supplier bank details changed shortly before a payment, sending money to an account the supplier does not control.", where: "Vendor bank history, change history" },
  { name: "Dormant vendor reactivation", area: "payment", desc: "Long-inactive suppliers suddenly paid again, often after a change to their details.", where: "Transaction history, change history" },
  { name: "Invoice anomalies", area: "payment", desc: "Statistical irregularities in invoice amounts and numbering that point to fabricated documents.", where: "Bills, supplier invoice numbers" },
  { name: "Round-tripping", area: "group", desc: "Money moved out and back through related parties to inflate revenue or disguise where cash came from.", where: "Intercompany and party ledgers" },
  { name: "Intercompany price variance", area: "group", desc: "The same supplier charging one group company materially more than another for the same item.", where: "Bill lines across entities" },
];

export const RISK_AREAS: { title: string; desc: string; tags: string[]; tone: "v" | "t" | "r" | "b" }[] = [
  { title: "Vendor identity", desc: "Fake or conflicted suppliers: vendors that exist only on paper, or staff hiding behind a vendor code.", tags: ["Ghost vendors", "Employee–vendor conflicts"], tone: "v" },
  { title: "Duplicate identities", desc: "One supplier under several names or codes, sharing a tax ID, bank account or address.", tags: ["Duplicate vendor identities"], tone: "v" },
  { title: "Approvals & authority", desc: "Spend shaped to dodge the approval matrix, so purchases never reach the right approver.", tags: ["Approval threshold avoidance"], tone: "t" },
  { title: "Ordering & receipt", desc: "Purchases approved after the fact, or paid with no goods received.", tags: ["Retrospective purchasing", "Payment without receipt"], tone: "t" },
  { title: "Payments & patterns", desc: "Double payments, diverted bank details, dormant vendors and invoices that look made up.", tags: ["Duplicate payments", "Payment diversion", "Dormant vendor reactivation", "Invoice anomalies"], tone: "r" },
  { title: "Across the group", desc: "Price gaps and shared identities that only appear when every company is read together.", tags: ["Duplicate vendor identities", "Round-tripping", "Intercompany price variance"], tone: "b" },
];

export const PARTIES = ["Apex Supplies", "Shree Ganesh Polymers", "Northline Traders", "Kaveri Logistics", "Vidarbha Steel Co", "Orion Packaging", "Sai Krupa Electricals", "Coastal Cotton Mills", "Bluefin Couriers", "Deccan Chemicals", "TestCo Exports", "Tanvi Print Works"];

export const SOURCES_1: [string, string, string, string][] = [
  ["Zoho Books", "#E4472A", "ZB", "ERP"],
  ["Tally Prime", "#2F6FDB", "TP", "ERP"],
  ["SAP", "#0A6ED1", "SAP", "ERP"],
  ["Change history", "#2F6FDB", "CH", ""],
  ["Vendor master", "#7C5CD6", "VM", ""],
  ["Bank accounts", "#1B8A84", "BA", ""],
];
export const SOURCES_2: [string, string, string, string][] = [
  ["HR & payroll", "#B07A45", "HR", ""],
  ["Goods receipts", "#1E8A5A", "GR", ""],
  ["Approval matrix", "#7C5CD6", "DA", ""],
  ["Callback register", "#D8452B", "CB", ""],
  ["Purchase orders", "#3567D6", "PO", ""],
  ["Item master", "#6E6E73", "IM", ""],
];

export type BoardCard = { id: string; party: string; entity: string; tag: string; note: string; amount: string; risk: number; color: string; date: string };
export const BOARD_COLUMNS: [string, string][] = [["New", "#3567D6"], ["Investigating", "#B7791F"], ["Escalated", "#D8452B"], ["Resolved", "#1E8A5A"]];
export const BOARD_CARDS: [number, BoardCard][] = [
  [0, { id: "f1", party: "Shree Ganesh Polymers", entity: ENTITIES.IND, tag: "Diversion", note: "Bank changed, then paid", amount: "₹6,40,000", risk: 92, color: "#D8452B", date: "13 Mar 2026" }],
  [0, { id: "f2", party: "Orion Packaging", entity: ENTITIES.RET, tag: "Duplicate", note: "Same invoice paid twice", amount: "₹1,18,400", risk: 81, color: "#D8452B", date: "12 Mar 2026" }],
  [0, { id: "f3", party: "Tanvi Print Works", entity: ENTITIES.EXP, tag: "New vendor", note: "New vendor paid quickly", amount: "₹2,75,000", risk: 64, color: "#B7791F", date: "12 Mar 2026" }],
  [1, { id: "f4", party: "Apex Supplies", entity: ENTITIES.IND, tag: "Shared ID", note: "Shares PAN with V-0448", amount: "₹1.9 Cr", risk: 88, color: "#D8452B", date: "10 Mar 2026" }],
  [1, { id: "f5", party: "Kaveri Logistics", entity: ENTITIES.EXP, tag: "Threshold", note: "Bills clustered under a limit", amount: "₹33,60,000", risk: 71, color: "#B7791F", date: "08 Mar 2026" }],
  [2, { id: "f6", party: "Northline Traders", entity: GROUP, tag: "Round-trip", note: "Purchase, advance, loan", amount: "₹48,00,000", risk: 95, color: "#D8452B", date: "09 Mar 2026" }],
  [3, { id: "f7", party: "Deccan Chemicals", entity: ENTITIES.IND, tag: "Retro PO", note: "PO after invoice, approved", amount: "₹84,200", risk: 42, color: "#6E6E73", date: "04 Mar 2026" }],
  [3, { id: "f8", party: "Bluefin Couriers", entity: ENTITIES.RET, tag: "Dormant", note: "Dormant vendor, seasonal", amount: "₹36,500", risk: 30, color: "#6E6E73", date: "02 Mar 2026" }],
];

export const FAQ: [string, string][] = [
  ["Do you need admin access to our ERP?", "No. Zenetra uses read-only connections. It can read vouchers, masters and change history, and it cannot post, edit or delete anything."],
  ["Where does our data live?", "Monitoring runs in your environment. Transaction data is not pooled with other clients, and credentials are encrypted at rest."],
  ["How is this different from periodic sampling?", "Sampling reviews a small set of transactions, usually after the period closes. Zenetra monitors every transaction on every sync, so issues surface while there is still time to act. It supports your existing reviews and does not replace them."],
  ["Does Zenetra block transactions?", "No. Zenetra monitors and flags. Your team reviews each flag with its evidence and decides what happens next."],
  ["What if a detection needs data we have not connected?", "The detection is marked as not run, with the missing source named. It is never shown as clean."],
  ["Which ERPs do you support?", "Zoho Books, Tally Prime, SAP and more. Talk to us about the system you run."],
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
