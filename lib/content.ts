// Page content and sample data. TestCo is the demo group used across every card.
// Rule IDs follow the RuleBook numbering. Names and descriptions explain the fraud scheme in plain
// language and never the detection logic, thresholds or the total number of rules.

export const GROUP = "TestCo";
export const ENTITIES = { IND: "TestCo Industries", EXP: "TestCo Exports", RET: "TestCo Retail" } as const;

export type Domain = "p2p" | "pay" | "o2c" | "r2r" | "bnk" | "grp";
export type Tone = "v" | "t" | "r" | "b" | "o" | "a";

export const DOMAIN_LABEL: Record<Domain, { short: string; risk: string; tone: Tone }> = {
  p2p: { short: "Purchasing", risk: "Purchasing risk", tone: "v" },
  pay: { short: "Payroll", risk: "Payroll risk", tone: "o" },
  o2c: { short: "Sales", risk: "Sales risk", tone: "t" },
  r2r: { short: "Ledger", risk: "Ledger risk", tone: "a" },
  bnk: { short: "Banking", risk: "Banking risk", tone: "r" },
  grp: { short: "Group", risk: "Group risk", tone: "b" },
};

type Kind = "Fraud indicator" | "Control weakness";
export type Pattern = { id: string; name: string; domain: Domain; kind: Kind; desc: string; where: string };

/** Fraud patterns shown in the library card and as tags in the risk areas. Interleaved so "All" shows the range. */
export const PATTERNS: Pattern[] = [
  { id: "P2P-11", name: "Bank details changed, then paid", domain: "p2p", kind: "Fraud indicator", desc: "A supplier's bank details change shortly before a payment goes out. This is the classic route for diverting a genuine payment.", where: "Vendor bank history, change log, payments" },
  { id: "PAY-04", name: "Salary paid after exit", domain: "pay", kind: "Fraud indicator", desc: "Salary keeps flowing in the name of someone who has already left, or who has no attendance on record.", where: "Payroll register, employee master" },
  { id: "R2R-12", name: "Back-dated postings", domain: "r2r", kind: "Fraud indicator", desc: "Entries keyed in long after their accounting date, quietly moving income or expense into another period.", where: "Journals, posting timestamps" },
  { id: "BNK-03", name: "Payment to an unknown account", domain: "bnk", kind: "Fraud indicator", desc: "Money leaves for a bank account that belongs to no known vendor, employee, customer or group company.", where: "Bank statements, all masters" },
  { id: "O2C-02", name: "Sale with no goods shipped", domain: "o2c", kind: "Fraud indicator", desc: "A sales invoice is booked with no matching delivery or stock movement, so the sale may not be real.", where: "Sales invoices, delivery notes, stock ledger" },
  { id: "RTP-01", name: "Closed-loop fund flows", domain: "grp", kind: "Fraud indicator", desc: "Money circles through group companies and back to where it started, inflating turnover with no trade behind it.", where: "Bank and intercompany ledgers" },
  { id: "P2P-01", name: "New vendor paid unusually fast", domain: "p2p", kind: "Fraud indicator", desc: "A freshly created supplier receives a large payment within days. Real suppliers rarely get paid that quickly.", where: "Vendor master, payments" },
  { id: "PAY-01", name: "Employees sharing one bank account", domain: "pay", kind: "Fraud indicator", desc: "Several employees are paid into the same account or share identity details, a strong sign of ghost employees.", where: "Employee master, payroll bank file" },
  { id: "R2R-09", name: "Overrides of system postings", domain: "r2r", kind: "Control weakness", desc: "System-generated entries are edited by hand or re-coded, bypassing the controls built into the ERP.", where: "Journals, change log" },
  { id: "BNK-05", name: "Pass-through accounts", domain: "bnk", kind: "Fraud indicator", desc: "Money arrives and leaves again almost unchanged within days, using the account as a conduit.", where: "Bank statements" },
  { id: "O2C-12", name: "Revenue without cash", domain: "o2c", kind: "Fraud indicator", desc: "A customer's booked sales keep growing while the cash never arrives.", where: "Sales invoices, receipts" },
  { id: "RPT-01", name: "Undisclosed related parties", domain: "grp", kind: "Fraud indicator", desc: "A counterparty shares identity, address, bank or directors with the company's owners but is not tagged as related.", where: "Party masters, director records" },
  { id: "P2P-02", name: "Employee behind a vendor code", domain: "p2p", kind: "Fraud indicator", desc: "A supplier's bank account, tax ID or contact details match an employee's, so staff may be paying themselves.", where: "Vendor master, employee master" },
  { id: "PAY-07", name: "Pay inflated for one run", domain: "pay", kind: "Fraud indicator", desc: "An employee's pay rate is raised just before payroll and quietly reset afterwards.", where: "Payroll register, change log" },
  { id: "R2R-13", name: "Missing voucher numbers", domain: "r2r", kind: "Control weakness", desc: "Gaps, deletions or cancellations in voucher sequences that can hide removed transactions.", where: "Voucher registers, change log" },
  { id: "BNK-02", name: "Circular bank transfers", domain: "bnk", kind: "Fraud indicator", desc: "Funds go out through intermediaries and come back in similar amounts soon after.", where: "Bank statements, party ledgers" },
  { id: "O2C-07", name: "Customer linked to a vendor or employee", domain: "o2c", kind: "Fraud indicator", desc: "A customer shares identifiers with a vendor, employee or group company, hinting at a disguised related-party sale.", where: "Customer, vendor and employee masters" },
  { id: "RTP-08", name: "Reused trade documents", domain: "grp", kind: "Fraud indicator", desc: "The same invoice or transport document appears across several legs or entities, a mark of circular trading.", where: "Invoices, transport documents" },
  { id: "P2P-07", name: "Paid without goods received", domain: "p2p", kind: "Fraud indicator", desc: "A bill is settled with no goods receipt or stock movement behind it, so the goods may never have arrived.", where: "Bills, goods receipts, stock ledger" },
  { id: "PAY-13", name: "Salary to an account not on file", domain: "pay", kind: "Fraud indicator", desc: "Pay is credited to a bank account other than the one in the employee master.", where: "Payroll bank file, employee master" },
  { id: "R2R-05", name: "Suspense balances that keep growing", domain: "r2r", kind: "Control weakness", desc: "Suspense and clearing accounts that never clear, a convenient place to park and hide items.", where: "Trial balance, suspense ledgers" },
  { id: "BNK-10", name: "Duplicate outward payment", domain: "bnk", kind: "Fraud indicator", desc: "The same beneficiary is paid the same amount twice in quick succession.", where: "Bank statements, payments" },
  { id: "O2C-03", name: "Sale reversed soon after booking", domain: "o2c", kind: "Control weakness", desc: "A sale is undone by a credit note shortly after the invoice, often to meet a period target.", where: "Sales invoices, credit notes" },
  { id: "RPT-11", name: "Shell-like related entities", domain: "grp", kind: "Fraud indicator", desc: "A related entity with little real activity, shared addresses or advisers, sitting deep in an ownership chain.", where: "Entity masters, ledgers" },
  { id: "P2P-03", name: "One supplier, many vendor codes", domain: "p2p", kind: "Fraud indicator", desc: "Several active vendor codes share a tax ID, bank account or address, used to split spend or pay twice.", where: "Vendor masters across entities" },
  { id: "PAY-12", name: "Reimbursements out of line with pay", domain: "pay", kind: "Fraud indicator", desc: "An employee's claims are unusually high against their salary, or sit at the maximum again and again.", where: "Expense claims, payroll register" },
  { id: "R2R-01", name: "Manual journals bunched at period end", domain: "r2r", kind: "Fraud indicator", desc: "Manual entries crowd into the last days of a period, a common way to adjust reported results.", where: "Journals" },
  { id: "BNK-01", name: "Cash kept just under limits", domain: "bnk", kind: "Fraud indicator", desc: "Cash entries sit just below handling limits, or are split so each piece stays small.", where: "Cash book, bank statements" },
  { id: "O2C-10", name: "Dormant customers revived at close", domain: "o2c", kind: "Fraud indicator", desc: "A long-idle customer suddenly receives a large invoice near period end.", where: "Customer master, sales invoices" },
  { id: "RTP-04", name: "Intercompany loans that net to zero", domain: "grp", kind: "Fraud indicator", desc: "Large loans flow out and back between group companies so the balance barely moves.", where: "Intercompany ledgers, bank statements" },
  { id: "P2P-09", name: "Duplicate vendor payment", domain: "p2p", kind: "Control weakness", desc: "The same supplier is paid the same amount twice against similar invoice references.", where: "Payments, supplier invoices" },
  { id: "R2R-02", name: "Postings at night or on holidays", domain: "r2r", kind: "Control weakness", desc: "Journals posted out of hours get less oversight and can point to management override.", where: "Journals, posting timestamps" },
  { id: "RPT-05", name: "Related-party deals routed through a middleman", domain: "grp", kind: "Fraud indicator", desc: "An apparently unrelated party passes money straight on to or from a related party.", where: "Party ledgers, bank statements" },
  { id: "RPT-10", name: "Owners trading as ordinary suppliers", domain: "grp", kind: "Fraud indicator", desc: "A significant shareholder deals with the company as if it were an ordinary vendor or customer.", where: "Shareholder records, party masters" },
  { id: "P2P-13", name: "Higher price at a sister company", domain: "grp", kind: "Fraud indicator", desc: "One supplier charges a group company more than another for the same item.", where: "Bill lines across entities" },
];

export const patternName = (id: string) => PATTERNS.find((p) => p.id === id)?.name ?? id;

/** Risk areas. Areas without rule IDs describe concepts on the roadmap, shown as plain tags. */
export const RISK_AREAS: { title: string; desc: string; tags: string[]; tone: Tone; concept?: boolean }[] = [
  { title: "Vendors & purchasing", desc: "Fake or conflicted suppliers, diverted payments and purchases paid for goods that never arrived.", tags: ["P2P-01", "P2P-03", "P2P-07", "P2P-11"], tone: "v" },
  { title: "Payroll & people", desc: "Ghost employees, pay that outlives an exit, and claims or pay rates nudged up for a single run.", tags: ["PAY-01", "PAY-04", "PAY-07", "PAY-13"], tone: "o" },
  { title: "Sales & receivables", desc: "Sales with nothing shipped, revenue that never turns into cash, and invoices undone after the period closes.", tags: ["O2C-02", "O2C-03", "O2C-12"], tone: "t" },
  { title: "Journals & period close", desc: "Back-dated, out-of-hours or bunched manual entries, overrides of system postings and missing vouchers.", tags: ["R2R-01", "R2R-09", "R2R-12", "R2R-13"], tone: "a" },
  { title: "Banking & cash", desc: "Payments to unknown accounts, money passing straight through, duplicate transfers and cash kept under limits.", tags: ["BNK-01", "BNK-03", "BNK-05", "BNK-10"], tone: "r" },
  { title: "Related parties", desc: "Owner-linked counterparties that are not disclosed, deals routed through middlemen, and shell-like entities.", tags: ["RPT-01", "RPT-05", "RPT-10", "RPT-11"], tone: "b" },
  { title: "Round-tripping", desc: "Money and paperwork moving in loops between group companies to inflate turnover or disguise funding.", tags: ["RTP-01", "RTP-04", "RTP-08", "P2P-13"], tone: "b" },
  { title: "Inventory & fixed assets", desc: "Stock that exists only on paper, write-offs timed to cover losses, and assets that are capitalised but never seen.", tags: ["Stock shrinkage", "Ghost assets", "Write-off timing"], tone: "v", concept: true },
  { title: "Ledger hygiene & expenses", desc: "Plug entries that force a reconciliation, privileged overrides, and expense claims that are duplicated or inflated.", tags: ["Plug entries", "Privileged overrides", "Duplicate claims"], tone: "a", concept: true },
];

/** Flag types shown in the live console, the ledger tooltip and the toast. */
export const FLAG_TYPES = [
  { id: "P2P-09", name: "Duplicate vendor payment", domain: "p2p" },
  { id: "P2P-11", name: "Bank details changed, then paid", domain: "p2p" },
  { id: "P2P-01", name: "New vendor paid unusually fast", domain: "p2p" },
  { id: "P2P-07", name: "Paid without goods received", domain: "p2p" },
  { id: "PAY-04", name: "Salary paid after exit", domain: "pay" },
  { id: "PAY-13", name: "Salary to an account not on file", domain: "pay" },
  { id: "PAY-07", name: "Pay inflated for one run", domain: "pay" },
  { id: "O2C-03", name: "Sale reversed soon after booking", domain: "o2c" },
  { id: "O2C-02", name: "Sale with no goods shipped", domain: "o2c" },
  { id: "R2R-12", name: "Back-dated posting", domain: "r2r" },
  { id: "R2R-02", name: "Posted on a public holiday", domain: "r2r" },
  { id: "R2R-09", name: "System posting overridden", domain: "r2r" },
  { id: "BNK-03", name: "Payment to an unknown account", domain: "bnk" },
  { id: "BNK-10", name: "Duplicate outward payment", domain: "bnk" },
  { id: "RTP-01", name: "Funds returned through group companies", domain: "grp" },
] as const;

export type FlagType = (typeof FLAG_TYPES)[number];
export const flagsFor = (d: Domain) => FLAG_TYPES.filter((f) => f.domain === d);

/** Entry types streaming through the live console: each has its own voucher prefix, parties and flags. */
export const ENTRY_KINDS: { vt: string; domain: Domain; weight: number; parties: string[] }[] = [
  { vt: "PV", domain: "p2p", weight: 4, parties: ["Apex Supplies", "Shree Ganesh Polymers", "Kaveri Logistics", "Vidarbha Steel Co", "Orion Packaging", "Sai Krupa Electricals", "Deccan Chemicals", "Tanvi Print Works"] },
  { vt: "SAL", domain: "pay", weight: 2, parties: ["Payroll · E-2207", "Payroll · E-1184", "Payroll · E-3051", "Reimbursement · E-0942"] },
  { vt: "SI", domain: "o2c", weight: 2, parties: ["Coastal Cotton Mills", "Northline Traders", "Kaveri Retail Mart", "Bluefin Couriers"] },
  { vt: "JV", domain: "r2r", weight: 2, parties: ["Period-close journal", "Provision adjustment", "Suspense clearing", "Intercompany recharge"] },
  { vt: "BNK", domain: "bnk", weight: 1, parties: ["Outward transfer", "Cash withdrawal", "Inward remittance"] },
];

export const SOURCES_1: [string, string, string, string][] = [
  ["Zoho Books", "#E4472A", "ZB", "ERP"],
  ["Tally Prime", "#2F6FDB", "TP", "ERP"],
  ["SAP", "#0A6ED1", "SAP", "ERP"],
  ["Change history", "#2F6FDB", "CH", ""],
  ["Vendor master", "#7C5CD6", "VM", ""],
  ["Customer master", "#1B8A84", "CM", ""],
  ["Bank statements", "#1E8A5A", "BS", ""],
];
export const SOURCES_2: [string, string, string, string][] = [
  ["Payroll register", "#B07A45", "PR", ""],
  ["Goods receipts", "#1E8A5A", "GR", ""],
  ["Stock ledger", "#6E6E73", "SL", ""],
  ["Approval matrix", "#7C5CD6", "DA", ""],
  ["Related-party register", "#3567D6", "RP", ""],
  ["Fixed asset register", "#B7791F", "FA", ""],
  ["Expense claims", "#D8452B", "EC", ""],
];

export type BoardCard = { id: string; party: string; entity: string; tag: string; note: string; amount: string; risk: number; color: string; date: string };
export const BOARD_COLUMNS: [string, string][] = [["New", "#3567D6"], ["Investigating", "#B7791F"], ["Escalated", "#D8452B"], ["Resolved", "#1E8A5A"]];
export const BOARD_CARDS: [number, BoardCard][] = [
  [0, { id: "f1", party: "Shree Ganesh Polymers", entity: ENTITIES.IND, tag: "P2P-11", note: "Bank changed, then paid", amount: "₹6,40,000", risk: 92, color: "#D8452B", date: "13 Mar 2026" }],
  [0, { id: "f2", party: "Employee E-2207", entity: ENTITIES.RET, tag: "PAY-04", note: "Salary paid after exit", amount: "₹84,500", risk: 86, color: "#D8452B", date: "12 Mar 2026" }],
  [0, { id: "f3", party: "Outward transfer", entity: ENTITIES.EXP, tag: "BNK-03", note: "Account not in any master", amount: "₹2,75,000", risk: 79, color: "#D8452B", date: "12 Mar 2026" }],
  [1, { id: "f4", party: "Apex Supplies", entity: ENTITIES.IND, tag: "P2P-03", note: "Shares PAN with V-0448", amount: "₹1.9 Cr", risk: 88, color: "#D8452B", date: "10 Mar 2026" }],
  [1, { id: "f5", party: "Kaveri Retail Mart", entity: ENTITIES.EXP, tag: "O2C-12", note: "Sales up, no cash collected", amount: "₹33,60,000", risk: 71, color: "#B7791F", date: "08 Mar 2026" }],
  [2, { id: "f6", party: "Northline Traders", entity: GROUP, tag: "RTP-01", note: "Funds returned via 3 entities", amount: "₹48,00,000", risk: 95, color: "#D8452B", date: "09 Mar 2026" }],
  [3, { id: "f7", party: "Period-close journal", entity: ENTITIES.IND, tag: "R2R-12", note: "Back-dated, explained", amount: "₹2,10,000", risk: 42, color: "#6E6E73", date: "04 Mar 2026" }],
  [3, { id: "f8", party: "Bluefin Couriers", entity: ENTITIES.RET, tag: "BNK-10", note: "Duplicate transfer, recalled", amount: "₹36,500", risk: 30, color: "#6E6E73", date: "02 Mar 2026" }],
];

export const FAQ: [string, string][] = [
  ["What kinds of fraud does Zenetra look for?", "Patterns across purchasing, payroll, sales and receivables, journals and period close, banking and cash, related parties, and round-tripping between group companies. Each detection is built around a known fraud scheme or control weakness, and every flag shows the entries behind it."],
  ["Do you need admin access to our ERP?", "No. Zenetra uses read-only connections. It can read vouchers, masters and change history, and it cannot post, edit or delete anything."],
  ["Where does our data live?", "Monitoring runs in your environment. Transaction data is not pooled with other clients, and credentials are encrypted at rest."],
  ["How is this different from periodic sampling?", "Sampling reviews a small set of transactions, usually after the period closes. Zenetra monitors every transaction on every sync, so issues surface while there is still time to act. It supports your existing reviews and does not replace them."],
  ["Does Zenetra block transactions?", "No. Zenetra monitors and flags. Your team reviews each flag with its evidence and decides what happens next."],
  ["What if a detection needs data we have not connected?", "The detection is marked as not run, with the missing source named. It is never shown as clean."],
  ["Which ERPs do you support?", "Zoho Books, Tally Prime, SAP and more. Talk to us about the system you run."],
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
