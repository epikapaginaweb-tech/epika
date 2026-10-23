import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TAGS, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  alternates: { canonical: "/privacidad" },
};

export default async function PrivacyPage() {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("hours");

  const { privacy } = await getSettings();

  return (
    <section className="container-page pb-10 pt-12 md:pt-20">
      <SectionHeading as="h1" eyebrow="Épika Academy" title="Aviso de" accent="privacidad." />
      <div className="mt-10 max-w-3xl rounded-[2rem] bg-white p-8 md:p-12">
        <p className="whitespace-pre-line leading-relaxed text-ink/75">{privacy}</p>
      </div>
    </section>
  );
}
