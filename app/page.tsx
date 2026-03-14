import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { WaitlistForm } from "@/components/waitlist-form";
import { WorldSection } from "@/components/world-section";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(214,160,80,0.12),transparent_22%),radial-gradient(circle_at_75%_20%,rgba(56,95,84,0.18),transparent_26%),linear-gradient(180deg,#081018_0%,#071019_35%,#05070c_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(4,7,12,0.2), rgba(4,7,12,0.86)), url('/images/mittlemarch-mountains.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top"
        }}
      />
      <Navbar />
      <Hero />
      <WorldSection />
      <Gallery />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
