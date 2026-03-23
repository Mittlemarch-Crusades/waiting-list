import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Mittlemarch",
  description: "Privacy disclosures for the Mittlemarch website and waitlist."
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage slug="privacy-policy" />;
}
