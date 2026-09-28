import type { Metadata } from "next";
import { LegalPage } from "@/components/page/LegalPage";
import { contact } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy policy", description: "How SecureKnots collects, uses and protects personal data." };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="September 2026"
      sections={[
        { h: "Who we are", p: ["SecureKnots provides cybersecurity compliance advisory services from offices in Wilmington, Delaware, United States and Bengaluru, India. This policy explains how we handle personal data collected through this website and in the course of our services."] },
        { h: "Data we collect", p: ["Information you provide through forms, such as your name, work email, company, phone number and message, and technical data such as device, browser and usage information collected with your consent through cookies."] },
        { h: "How we use it", p: ["To respond to enquiries, deliver and improve our services, send communications you have requested, and meet legal obligations. We do not sell personal data."] },
        { h: "Legal bases", p: ["Where GDPR or similar laws apply, we process data on the basis of consent, contract, legitimate interests or legal obligation, as appropriate to each purpose."] },
        { h: "Cookies", p: ["Essential cookies keep the site working. Analytics and marketing cookies are only set with your consent, which you can change at any time by clearing the preference stored in your browser."] },
        { h: "Sharing & transfers", p: ["We share data with service providers who process it on our behalf under appropriate agreements. Where data is transferred internationally, we use recognised safeguards."] },
        { h: "Retention & security", p: ["We keep personal data only as long as needed for the purposes above and protect it with administrative, technical and physical safeguards appropriate to the risk."] },
        { h: "Your rights", p: [`Depending on where you live, you may have rights to access, correct, delete or port your data, and to object to or restrict processing. Contact ${contact.email} to exercise them.`] },
        { h: "Contact", p: [`Questions about this policy can be sent to ${contact.email}.`] },
      ]}
    />
  );
}
