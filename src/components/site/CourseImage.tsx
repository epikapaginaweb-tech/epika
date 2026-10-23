import Image from "next/image";
import { CoverArt } from "./CoverArt";

type Props = {
  src: string | null;
  title: string;
  sizes: string;
  eager?: boolean;
  className?: string;
  label?: string;
  seed?: string;
};

export function CourseImage({ src, title, sizes, eager, className = "", label, seed }: Props) {
  if (!src) return <CoverArt seed={seed ?? title} label={label} className={className} />;
  return (
    <Image
      src={src}
      alt={title}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      className={`object-cover ${className}`}
    />
  );
}
