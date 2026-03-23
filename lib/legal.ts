import { readFile } from "fs/promises";
import path from "path";

export const legalDocuments = {
  "privacy-policy": {
    title: "Privacy Policy",
    description: "How Mittlemarch collects, uses, and protects information shared through the site.",
    fileName: "privacy-policy.md"
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "The terms that govern access to and use of the Mittlemarch website.",
    fileName: "terms-of-service.md"
  }
} as const;

export type LegalSlug = keyof typeof legalDocuments;

export type LegalBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export async function getLegalDocument(slug: LegalSlug) {
  const meta = legalDocuments[slug];
  const filePath = path.join(process.cwd(), "content", "legal", meta.fileName);
  const markdown = await readFile(filePath, "utf8");

  return {
    ...meta,
    slug,
    content: parseMarkdown(markdown)
  };
}

function parseMarkdown(markdown: string): LegalBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: LegalBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index];
    const line = raw.trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2).trim());
        index += 1;
      }

      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];

      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s/, "").trim());
        index += 1;
      }

      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const candidate = lines[index].trim();

      if (
        !candidate ||
        candidate.startsWith("## ") ||
        candidate.startsWith("### ") ||
        candidate.startsWith("- ") ||
        /^\d+\.\s/.test(candidate)
      ) {
        break;
      }

      paragraphLines.push(candidate);
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" ")
    });
  }

  return blocks;
}
