import Image from "next/image";
import { CoverArt } from "./CoverArt";

export type Tile = { key: string; name: string; image: string | null };

function Row({ tiles, reverse }: { tiles: Tile[]; reverse?: boolean }) {
  const list = [...tiles, ...tiles];
  return (
    <div className="overflow-hidden py-3">
      <div
        className={`flex w-max gap-5 pr-5 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": `${Math.max(tiles.length * 4, 28)}s` } as React.CSSProperties}
      >
        {list.map((tile, i) => (
          <div
            key={`${tile.key}-${i}`}
            className="relative size-16 shrink-0 overflow-hidden rounded-2xl shadow-md ring-2 ring-white sm:size-20"
            style={{ transform: `rotate(${((i * 37) % 13) - 6}deg) translateY(${((i * 53) % 20) - 10}px)` }}
          >
            {tile.image ? (
              <Image src={tile.image} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              <CoverArt seed={tile.name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FloatingTiles({ tiles, children }: { tiles: Tile[]; children: React.ReactNode }) {
  let pool = tiles;
  while (pool.length > 0 && pool.length < 10) pool = [...pool, ...tiles];
  const half = Math.ceil(pool.length / 2);

  return (
    <div className="relative">
      <div aria-hidden>
        <Row tiles={pool.slice(0, half)} />
      </div>
      <div className="relative z-10 py-10">{children}</div>
      <div aria-hidden>
        <Row tiles={pool.slice(half)} reverse />
      </div>
    </div>
  );
}
