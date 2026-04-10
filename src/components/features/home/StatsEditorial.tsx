'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { StatCounter } from '@/components/features/stats/StatCounter';

type Figure = {
  index: string;
  kicker: string;
  value: number;
  format?: string;
  label: string;
  caption: string;
};

const FIGURES: Figure[] = [
  {
    index: '01',
    kicker: 'Depuis 2020',
    value: 6,
    label: "Années d'exercice",
    caption: 'Une maison jeune, une exigence ancienne.',
  },
  {
    index: '02',
    kicker: 'Flotte',
    value: 5,
    label: 'Véhicules entretenus',
    caption: 'Des berlines soignées, prêtes à toute heure.',
  },
  {
    index: '03',
    kicker: 'Passages',
    value: 60000,
    format: '+',
    label: 'Voyageurs transportés',
    caption: 'Autant de courses, autant de confiances.',
  },
];

export function StatsEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px -15% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-b border-primary/20 bg-background py-28 px-6 md:py-36 lg:px-12"
    >
      {/* Diagonal gold wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(115deg, rgba(212,175,55,0.05) 0%, transparent 35%, transparent 65%, rgba(212,175,55,0.04) 100%)',
        }}
      />

      {/* Corner monograms */}
      <div className="pointer-events-none absolute left-6 top-6 hidden items-center gap-3 md:flex">
        <span className="h-px w-8 bg-primary/50" />
        <span className="font-serif text-xs italic text-primary/60">En chiffres</span>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 hidden items-center gap-3 md:flex">
        <span className="font-serif text-xs italic text-primary/60">MMXX—MMXXVI</span>
        <span className="h-px w-8 bg-primary/50" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center md:mb-28"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-primary/70" />
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.4em] text-primary">
              Six années en bref
            </span>
            <span className="h-px w-10 bg-primary/70" />
          </div>
          <h2 className="font-serif text-4xl leading-[0.95] text-on-surface sm:text-5xl md:text-6xl lg:text-7xl">
            Une maison qui se lit
            <br />
            <em className="text-primary">dans ses chiffres.</em>
          </h2>
        </motion.div>

        {/* Figures */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3 md:gap-x-12">
          {FIGURES.map((fig, i) => (
            <motion.div
              key={fig.index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3 + i * 0.18,
              }}
              className="group relative flex flex-col"
            >
              {/* Top index row */}
              <div className="mb-6 flex items-center justify-between">
                <span className="font-serif text-sm italic text-primary/70">{fig.index}</span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-on-surface-dim">
                  {fig.kicker}
                </span>
              </div>

              {/* Hairline */}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.45 + i * 0.18,
                }}
                style={{ transformOrigin: 'left' }}
                className="mb-8 block h-px w-full bg-gradient-to-r from-primary/60 via-on-surface/20 to-transparent"
              />

              {/* The number */}
              <div className="mb-6 font-serif text-[110px] italic leading-[0.85] text-primary transition-transform duration-700 ease-out group-hover:-translate-y-1 md:text-[128px]">
                <StatCounter end={fig.value} format={fig.format ?? ''} />
              </div>

              {/* Label */}
              <p className="mb-3 font-serif text-xl italic text-on-surface md:text-2xl">
                {fig.label}
              </p>

              {/* Caption */}
              <p className="font-sans text-[13px] leading-relaxed text-on-surface-dim">
                {fig.caption}
              </p>

              {/* Footer monogram */}
              <div className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-[3px] w-[3px] rounded-full bg-primary transition-all duration-500 group-hover:w-8"
                />
                <span className="font-serif text-[10px] italic text-primary/60">TL</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
