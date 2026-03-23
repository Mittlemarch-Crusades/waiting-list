import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Terms of Service | Mittlemarch",
  description: "Terms governing use of the Mittlemarch website."
};

export default function TermsOfServicePage() {
  return <LegalDocumentPage slug="terms-of-service" />;
}
