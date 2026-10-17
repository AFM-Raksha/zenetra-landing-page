import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Zenetra collects, uses and protects personal data shared through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const L = LEGAL;
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy"
      intro={`This policy explains how ${L.company} ("we", "us"), which offers ${L.brand}, handles personal data you share through this website. It is written to meet India's Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and its rules.`}>

      <h2>Who we are</h2>
      <p>{L.company} is the data fiduciary for personal data collected on this website. Our registered office is at {L.address}. You can reach us about privacy at <a href={`mailto:${L.contactEmail}`}>{L.contactEmail}</a>.</p>

      <h2>What we collect</h2>
      <p>When you request a demo, we collect the details you enter in the form:</p>
      <ul>
        <li>Your full name and work email address</li>
        <li>Your company or group name</li>
        <li>The number of companies in your group and the accounting system (ERP) you use</li>
      </ul>
      <p>When you visit the site, our hosting provider automatically records technical information such as your IP address, browser type and the pages requested. This is used to run and secure the site. We do not use advertising or analytics cookies, and we do not track you across other websites.</p>
      <p>This policy covers the website only. Data processed by the {L.brand} product for customers is covered by the agreement we sign with each customer.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To respond to your demo request and arrange a walkthrough</li>
        <li>To follow up about {L.brand} if you have asked us to</li>
        <li>To keep the website secure, prevent spam and abuse, and fix problems</li>
        <li>To meet legal obligations</li>
      </ul>
      <p>We process your form details on the basis of the consent you give when you submit the form. You can withdraw that consent at any time by emailing us, and we will stop using your details for these purposes.</p>
      <p>We do not sell your personal data, and we do not use it for automated decisions about you.</p>

      <h2>Who we share it with</h2>
      <p>We share data only with service providers that help us run this website and respond to you, under contracts that require them to protect it:</p>
      <ul>
        <li>Website hosting (Vercel)</li>
        <li>Email delivery for sending your request to our team</li>
        <li>Database hosting for storing demo requests</li>
      </ul>
      <p>Some of these providers may store or process data outside India. Where that happens, we rely on their contractual and security commitments, and we follow any restrictions the Government of India places on such transfers. We may also disclose data where the law requires it.</p>

      <h2>How long we keep it</h2>
      <p>We keep demo-request details for up to {L.retentionMonths} months after our last contact with you, unless you ask us to delete them sooner or the law requires us to keep them longer. Hosting logs are kept for a short period set by our hosting provider.</p>

      <h2>How we protect it</h2>
      <p>We use reasonable security safeguards, including encrypted connections (HTTPS), restricted access to stored requests, and encrypted credentials for the services we use. No method of transmission or storage is completely secure, but we work to protect your data and will notify you and the authorities of a breach where the law requires.</p>

      <h2>Your rights</h2>
      <p>Under the Digital Personal Data Protection Act, 2023, you can:</p>
      <ul>
        <li>Ask for a summary of the personal data we hold about you and how we use it</li>
        <li>Ask us to correct, complete or update it</li>
        <li>Ask us to erase it, unless we must keep it by law</li>
        <li>Withdraw your consent</li>
        <li>Nominate another person to exercise these rights for you in case of death or incapacity</li>
        <li>Raise a grievance with us, and then with the Data Protection Board of India if it is not resolved</li>
      </ul>
      <p>To use any of these rights, email <a href={`mailto:${L.contactEmail}`}>{L.contactEmail}</a>. We will respond within the time the law allows.</p>

      <h2>Grievance Officer</h2>
      <p>If you have a concern about how we handle your data, contact our Grievance Officer, {L.grievanceOfficer}, at <a href={`mailto:${L.grievanceEmail}`}>{L.grievanceEmail}</a> or at our registered office. We will acknowledge your complaint promptly and aim to resolve it within 30 days.</p>

      <h2>Children</h2>
      <p>This website is meant for businesses. It is not directed at anyone under 18, and we do not knowingly collect their data.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The effective date at the top shows when it last changed. If a change significantly affects how we use your data, we will tell you before it applies.</p>
    </LegalPage>
  );
}
