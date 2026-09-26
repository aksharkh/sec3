import type { Metadata } from "next";
import { LegalPage } from "@/components/page/LegalPage";
import { contact } from "@/lib/content";

export const metadata: Metadata = { title: "Terms of use", description: "Terms governing use of the SecureKnots website." };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="September 2026"
      sections={[
        { h: "Acceptance", p: ["By using this website you agree to these terms. If you do not agree, please do not use the site."] },
        { h: "Information only", p: ["Content on this site is general information and does not constitute legal, audit or professional advice. Engagements are governed by separate written agreements."] },
        { h: "Intellectual property", p: ["The site design, text, graphics and marks are owned by SecureKnots or its licensors and may not be reproduced without permission."] },
        { h: "Acceptable use", p: ["You agree not to misuse the site, attempt unauthorised access, or interfere with its operation. Security researchers who identify an issue are welcome to report it responsibly to " + contact.email + "."] },
        { h: "Liability", p: ["To the extent permitted by law, SecureKnots is not liable for losses arising from use of the site or reliance on its content."] },
        { h: "Changes", p: ["We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms."] },
      ]}
    />
  );
}
