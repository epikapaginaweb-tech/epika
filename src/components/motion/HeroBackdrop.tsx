"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export function HeroBackdrop() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const orangeX = useTransform(sx, (v) => v * 60);
  const orangeY = useTransform(sy, (v) => v * 40);
  const navyX = useTransform(sx, (v) => v * -80);
  const navyY = useTransform(sy, (v) => v * -50);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,41,82,0.09)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <motion.div style={{ x: orangeX, y: orangeY }} className="absolute -right-24 top-10 size-[28rem] md:right-[8%]">
        <div className="size-full animate-blob rounded-full bg-orange/25 blur-3xl" />
      </motion.div>
      <motion.div style={{ x: navyX, y: navyY }} className="absolute -left-32 top-1/3 size-[30rem] md:left-[4%]">
        <div className="size-full animate-blob rounded-full bg-navy/15 blur-3xl [animation-delay:-6s]" />
      </motion.div>
      <motion.div style={{ x: navyX, y: orangeY }} className="absolute bottom-0 left-1/2 size-72 -translate-x-1/2">
        <div className="size-full animate-blob rounded-full bg-orange-soft blur-3xl [animation-delay:-3s]" />
      </motion.div>
    </div>
  );
}
