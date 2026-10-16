import { SpriteDefs } from "@/components/Icons";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsSources from "@/components/StatsSources";
import ContinuousCard from "@/components/ContinuousCard";
import Features from "@/components/Features";
import GroupView from "@/components/GroupView";
import HowItWorks from "@/components/HowItWorks";
import RiskAreas from "@/components/RiskAreas";
import FlagBoard from "@/components/FlagBoard";
import Security from "@/components/Security";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { FAQ } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Structured data for search engines: the organisation, the product, and the FAQ shown on the page.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon.png` },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SpriteDefs />
      <Nav />
      <main id="top">
        <Hero />
        <StatsSources />
        <ContinuousCard />
        <Features />
        <GroupView />
        <HowItWorks />
        <RiskAreas />
        <FlagBoard />
        <Security />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
