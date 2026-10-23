import { RevealText } from "../motion/RevealText";

type Props = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, accent, description, align = "left", as = "h2" }: Props) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="eyebrow">
          {eyebrow.split(" ")[0]} <span className="script-accent">{eyebrow.split(" ").slice(1).join(" ")}</span>
        </p>
      )}
      <RevealText
        as={as}
        text={title}
        accent={accent}
        className={`mt-3 font-bold tracking-tight text-navy ${as === "h1" ? "text-4xl leading-[1.05] md:text-6xl" : "text-3xl leading-[1.1] md:text-5xl"}`}
      />
      {description && <p className={`mt-5 text-base leading-relaxed text-ink/65 md:text-lg ${centered ? "mx-auto" : ""} max-w-2xl`}>{description}</p>}
    </div>
  );
}
