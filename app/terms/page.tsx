import Link from "next/link";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use the Zenetra website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const L = LEGAL;
  return (
    <LegalPage eyebrow="Legal" title="Terms of Use"
      intro={`These terms apply when you use this website, which is operated by ${L.company} and describes ${L.brand}. By using the site, you agree to them. If you do not agree, please do not use the site.`}>

      <h2>About this website</h2>
      <p>This website gives general information about {L.brand} and lets you request a demo. Use of the {L.brand} product itself is governed by a separate written agreement between {L.company} and each customer. Nothing on this website forms part of that agreement or is an offer to enter into one.</p>

      <h2>Information on the site</h2>
      <p>We try to keep the content accurate and current, but it is provided for general information only. It is not legal, accounting, audit or financial advice, and you should not rely on it as such.</p>
      <p>The companies, people, transactions, amounts and flags shown in examples and animations on this site, including &quot;TestCo&quot;, are fictional and used for illustration only. Any resemblance to real entities is coincidental. Descriptions of fraud patterns are general and do not describe how {L.brand} detects them.</p>
      <p>{L.brand} monitors transactions and raises flags for review. It does not prevent or block transactions, and a flag is not a finding of fraud. Decisions on flags rest with the customer.</p>

      <h2>Acceptable use</h2>
      <p>When using this website, you agree not to:</p>
      <ul>
        <li>Submit false information or someone else&apos;s details in the demo-request form</li>
        <li>Send spam or automated requests, or try to overload, probe or disrupt the site</li>
        <li>Try to gain unauthorised access to the site, its servers or any connected systems</li>
        <li>Copy, scrape or reuse the site&apos;s content in bulk, or use it in a way that breaks any law</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>The {L.brand} name, logo, design, text, graphics and software on this website belong to {L.company} or its licensors and are protected by law. You may view and share pages for your own internal evaluation of {L.brand}. Any other use needs our written permission.</p>

      <h2>Links to other sites</h2>
      <p>This site may link to websites we do not control. We are not responsible for their content or privacy practices.</p>

      <h2>No warranties</h2>
      <p>The website is provided &quot;as is&quot; and &quot;as available&quot;. To the extent the law allows, we make no warranties about it, including that it will be uninterrupted, error-free or free of harmful components.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent the law allows, {L.company} is not liable for any indirect, incidental or consequential loss, or for loss of data, profit or business, arising from your use of this website or reliance on its content.</p>

      <h2>Privacy</h2>
      <p>Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal data you share through this website.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. The courts at {L.jurisdictionCity} have exclusive jurisdiction over any dispute arising from them or from your use of this website.</p>

      <h2>Changes and contact</h2>
      <p>We may update these terms from time to time; the effective date at the top shows when they last changed. Questions about these terms can be sent to <a href={`mailto:${L.contactEmail}`}>{L.contactEmail}</a>, or to {L.company}, {L.address}.</p>
    </LegalPage>
  );
}
