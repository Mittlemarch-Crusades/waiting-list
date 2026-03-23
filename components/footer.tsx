import { siteContent, WORLD_NAME } from "@/config/world";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container-shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-[family-name:var(--font-heading)] text-3xl uppercase text-stone-100">
            {siteContent.footer.tagline}
          </p>
          <p className="mt-3 max-w-xl text-stone-400">
            Ancient banners rise soon. Follow the signals and be there when the first road into Mittlemarch opens.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:items-end">
          <div className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.24em] text-stone-300">
            {siteContent.footer.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className="transition hover:text-amber-100"
              >
                {social.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.24em] text-stone-500">
            {siteContent.footer.legal.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-amber-100">
                {item.label}
              </a>
            ))}
          </div>
          <p className="text-sm text-stone-500">(c) {new Date().getFullYear()} {WORLD_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
