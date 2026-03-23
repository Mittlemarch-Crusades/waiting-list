import Link from "next/link";
import type { ReactNode } from "react";

import { type LegalBlock, type LegalSlug, getLegalDocument } from "@/lib/legal";

type LegalDocumentPageProps = {
  slug: LegalSlug;
};

export async function LegalDocumentPage({ slug }: LegalDocumentPageProps) {
  const document = await getLegalDocument(slug);

  return (
    <main className="relative overflow-x-hidden py-28 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(214,160,80,0.1),transparent_24%),radial-gradient(circle_at_70%_18%,rgba(56,95,84,0.15),transparent_24%),linear-gradient(180deg,#081018_0%,#071019_35%,#05070c_100%)]"
      />

      <div className="container-shell">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="section-kicker inline-flex items-center gap-3 transition hover:text-amber-100"
          >
            <span aria-hidden="true">&larr;</span>
            Return to Mittlemarch
          </Link>

          <header className="mt-8">
            <p className="section-kicker">Legal</p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl uppercase leading-tight text-stone-50 sm:text-5xl">
              {document.title}
            </h1>
            <p className="mt-5 font-[family-name:var(--font-serif)] text-2xl leading-relaxed text-stone-300/82">
              {document.description}
            </p>
          </header>

          <article className="panel gold-frame mt-10 p-8 sm:p-10">
            <div className="space-y-8">
              {document.content.map((block, index) => (
                <LegalBlockRenderer key={`${block.type}-${index}`} block={block} />
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

function LegalBlockRenderer({ block }: { block: LegalBlock }) {
  if (block.type === "h2") {
    return (
      <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold leading-snug text-stone-100 sm:text-3xl">
        {block.text}
      </h2>
    );
  }

  if (block.type === "h3") {
    return (
      <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold leading-snug text-stone-100 sm:text-2xl">
        {block.text}
      </h3>
    );
  }

  if (block.type === "ul") {
    return (
      <ul className="space-y-3">
        {block.items.map((item) => (
          <li
            key={item}
            className="font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-300/84"
          >
            {renderInlineText(item, true)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol className="space-y-3">
        {block.items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-300/84"
          >
            <span className="mr-3 text-amber-200/75">{index + 1}.</span>
            {renderInlineText(item)}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p className="font-[family-name:var(--font-serif)] text-xl leading-relaxed text-stone-300/84">
      {renderInlineText(block.text)}
    </p>
  );
}

function renderInlineText(text: string, bullet = false) {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <a
        key={`${match[2]}-${match.index}`}
        href={match[2]}
        className="text-amber-100 transition hover:text-amber-50"
        target={match[2].startsWith("http") ? "_blank" : undefined}
        rel={match[2].startsWith("http") ? "noreferrer" : undefined}
      >
        {match[1]}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return (
    <>
      {bullet ? <span className="mr-3 text-amber-200/75">&bull;</span> : null}
      {nodes}
    </>
  );
}
