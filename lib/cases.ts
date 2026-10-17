import { ENTITIES } from "./content";

// Sample flags for the Evidence card. Each page load shows three, picked at random.
// All names, people and amounts are illustrative TestCo demo data.
// Summaries mark evidence references as [1], [2]… which render as superscripts.

export type CaseFile = {
  id: string;
  segment: string;
  severity: "High risk" | "Medium risk";
  entity: string;
  title: string;
  meta: string;
  summary: string;
  evidence: { text: string; src: string }[];
  pattern: { name: string; what: string; category: string };
};

export const CASES: CaseFile[] = [
  {
    id: "P2P-11", segment: "Purchasing", severity: "High risk", entity: ENTITIES.IND,
    title: "Bank details changed, then paid next morning",
    meta: "Shree Ganesh Polymers · ₹6,40,000 · 13 Mar 2026",
    summary: "The bank account for Shree Ganesh Polymers was changed at 18:42 on 12 March[1], and ₹6.4 lakh was paid to the new account at 10:05 the next morning[2]. The same user made both entries. No callback confirms the change[3], and all 41 earlier payments went to the old account[4].",
    evidence: [
      { text: "Bank account changed ••2209 → ••8817", src: "Tally change history · user ACC-04 · 12 Mar 18:42" },
      { text: "₹6,40,000 paid to ••8817", src: "PV/25-26/1184 · ACC-04 · 13 Mar 10:05" },
      { text: "No callback verification on record", src: "Callback register" },
      { text: "41 earlier payments, all to ••2209", src: "Payment history · Apr 2023 to Feb 2026" },
    ],
    pattern: { name: "Payment diversion", what: "Supplier bank details are changed shortly before a payment, so money goes to an account the supplier does not control.", category: "Purchasing · Fraud indicator" },
  },
  {
    id: "PAY-04", segment: "Payroll", severity: "High risk", entity: ENTITIES.RET,
    title: "Salary paid three months after exit",
    meta: "Employee E-207 · ₹84,500 a month · 31 Mar 2026",
    summary: "Employee E-207 left on 31 December[1], but salary was credited in January, February and March[2]. There is no attendance after the exit date[3], and the salary account was changed two days after the exit[4].",
    evidence: [
      { text: "Exit recorded, last working day 31 Dec 2025", src: "Employee master · HR-03 · 02 Jan" },
      { text: "Salary credited for Jan, Feb and Mar 2026", src: "SAL/25-26/0412, 0498, 0571" },
      { text: "No attendance since 01 Jan 2026", src: "Attendance register" },
      { text: "Salary account changed ••7730 → ••1904", src: "Change history · user PAY-02 · 02 Jan 11:15" },
    ],
    pattern: { name: "Salary after exit", what: "Pay keeps flowing in the name of someone who has left, often to an account controlled by someone else.", category: "Payroll · Fraud indicator" },
  },
  {
    id: "PAY-01", segment: "Payroll", severity: "High risk", entity: ENTITIES.RET,
    title: "Three employees paid into one bank account",
    meta: "E-351, E-302, E-360 · ₹1,26,000 in March · 31 Mar 2026",
    summary: "Three employees on the TestCo Retail payroll are paid into the same account[1]. All three were created in the same week by one user[2], two of them have no attendance on record[3], and together they drew ₹1.26 lakh in March[4].",
    evidence: [
      { text: "E-351, E-302 and E-360 share account ••5120", src: "Employee master · payroll bank file" },
      { text: "All three created 03–06 Feb by user HR-07", src: "Change history" },
      { text: "No attendance for E-351 or E-360", src: "Attendance register · Feb and Mar" },
      { text: "₹1,26,000 paid across the three in March", src: "SAL/25-26/0566–0568" },
    ],
    pattern: { name: "Ghost employees", what: "Fictitious or duplicate employees added to payroll so that salary can be collected by someone else.", category: "Payroll · Fraud indicator" },
  },
  {
    id: "O2C-02", segment: "Sales", severity: "High risk", entity: ENTITIES.EXP,
    title: "Year-end sale with nothing shipped",
    meta: "Kaveri Retail Mart · ₹18,40,000 · 31 Mar 2026",
    summary: "A ₹18.4 lakh invoice to Kaveri Retail Mart was booked late on 31 March[1]. No delivery note or e-way bill is linked to it[2], stock of the item did not move[3], and a credit note for the full amount followed four days later[4].",
    evidence: [
      { text: "Sales invoice booked at 23:10 on 31 Mar", src: "SI/25-26/2231 · user SLS-05" },
      { text: "No delivery note or e-way bill linked", src: "Delivery register" },
      { text: "Item stock unchanged from 28 Mar to 04 Apr", src: "Stock ledger · finished goods" },
      { text: "Credit note for ₹18,40,000 on 04 Apr", src: "CN/26-27/0007" },
    ],
    pattern: { name: "Fictitious sales", what: "Sales booked without any goods leaving the business, often near period end and reversed afterwards.", category: "Sales · Fraud indicator" },
  },
  {
    id: "R2R-12", segment: "Ledger", severity: "Medium risk", entity: ENTITIES.IND,
    title: "Journal back-dated into the closed year",
    meta: "JV/25-26/0912 · ₹12,50,000 · entered 09 Apr 2026",
    summary: "A journal releasing a ₹12.5 lakh provision was keyed in on 9 April but dated 28 March[1], after the year had been locked[2]. It carries only the narration \"adjustment\"[3], and it raised the year's profit by the full amount[4].",
    evidence: [
      { text: "Entered 09 Apr 2026, dated 28 Mar 2026", src: "JV/25-26/0912 · user FIN-01" },
      { text: "Period lock lifted and re-applied the same day", src: "Change history · 09 Apr 17:02–17:20" },
      { text: "Narration reads \"adjustment\"", src: "Journal register" },
      { text: "Provision released to profit", src: "Ledger · Provisions → Other income" },
    ],
    pattern: { name: "Back-dated entries", what: "Entries keyed in after a period closes but dated inside it, moving income or expense between periods.", category: "Ledger · Fraud indicator" },
  },
  {
    id: "BNK-05", segment: "Banking", severity: "High risk", entity: ENTITIES.EXP,
    title: "₹25 lakh in and out within two days",
    meta: "Current account ••6610 · ₹25,00,000 · 05 Mar 2026",
    summary: "₹25 lakh arrived from Orion Packaging on 3 March[1] and ₹24.8 lakh left for Sai Krupa Electricals two days later[2]. Neither movement has an invoice or order behind it[3], and the account normally holds under ₹2 lakh[4].",
    evidence: [
      { text: "₹25,00,000 received from Orion Packaging", src: "Bank statement ••6610 · 03 Mar" },
      { text: "₹24,80,000 paid to Sai Krupa Electricals", src: "Bank statement ••6610 · 05 Mar" },
      { text: "No sales or purchase document linked to either", src: "Receipts and payments registers" },
      { text: "Average balance under ₹2,00,000", src: "Bank statements · Oct 2025 to Feb 2026" },
    ],
    pattern: { name: "Pass-through account", what: "Money arrives and leaves almost unchanged within days, using the company's account as a conduit.", category: "Banking · Fraud indicator" },
  },
  {
    id: "RPT-10", segment: "Related parties", severity: "High risk", entity: ENTITIES.IND,
    title: "Director-linked firm billed as an ordinary vendor",
    meta: "Vidarbha Steel Co · ₹62,00,000 this year · 31 Mar 2026",
    summary: "Vidarbha Steel Co shares its registered address with a director's residence[1] but is not tagged as a related party[2]. It billed ₹62 lakh across 14 invoices this year[3], at rates above two other suppliers of the same grade[4].",
    evidence: [
      { text: "Registered address matches a director's residence", src: "Vendor master · director register" },
      { text: "Not tagged as a related party", src: "Related-party register" },
      { text: "14 bills totalling ₹62,00,000", src: "PUR/25-26 · Apr 2025 to Mar 2026" },
      { text: "Rates above two other suppliers of the same grade", src: "Bill lines · same item, same quarter" },
    ],
    pattern: { name: "Undisclosed related party", what: "A counterparty linked to the owners or directors trades with the company as if it were independent.", category: "Group · Fraud indicator" },
  },
  {
    id: "P2P-07", segment: "Purchasing", severity: "Medium risk", entity: ENTITIES.IND,
    title: "Paid in full for goods never received",
    meta: "Deccan Chemicals · ₹4,35,000 · 20 Feb 2026",
    summary: "A ₹4.35 lakh bill from Deccan Chemicals was raised against an order[1] and paid in full on 20 February[2]. No goods receipt was ever recorded[3], and the item's stock has not moved since January[4].",
    evidence: [
      { text: "Bill raised against PO 4471", src: "PUR/25-26/3318 · 11 Feb" },
      { text: "Paid in full", src: "PV/25-26/1307 · 20 Feb" },
      { text: "No goods receipt recorded against PO 4471", src: "Goods receipt register" },
      { text: "No stock movement for the item since 08 Jan", src: "Stock ledger · raw materials" },
    ],
    pattern: { name: "Payment without receipt", what: "Bills are settled for goods or services that cannot be traced to a receipt or stock movement.", category: "Purchasing · Fraud indicator" },
  },
];
