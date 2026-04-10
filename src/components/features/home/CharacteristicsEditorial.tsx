'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type Characteristic = {
  roman: string;
  kicker: string;
  title: string;
  description: string;
};

const ITEMS: Characteristic[] = [
  {
    roman: 'I',
    kicker: 'Le geste',
    title: 'Personnel',
    description:
      'Accueil soigné, porte ouverte, voix posée. Chaque course est une petite hospitalité, jamais un simple trajet.',
  },
  {
    roman: 'II',
    kicker: 'La tenue',
    title: 'Professionnel',
    description:
      'Chauffeurs expérimentés, véhicules irréprochables, itinéraires étudiés. L\u2019exigence se mesure au détail.',
  },
  {
    roman: 'III',
    kicker: 'Le soin',
    title: 'Médical',
    description:
      'Formation dédiée et protocoles éprouvés pour accompagner vos trajets de santé avec la discrétion qu\u2019ils méritent.',
  },
];

export function CharacteristicsEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface py-28 px-6 md:py-36 lg:px-12"
    >
      {/* Soft radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 0%, rgba(212,175,55,0.06) 0%, transparent 55%)',
        }}
      />

      {/* Vertical label, right rail */}
      <div className="pointer-events-none absolute right-4 top-0 bottom-0 hidden lg:flex items-center">
        <div className="origin-right rotate-90 whitespace-nowrap -translate-x-3">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.45em] text-primary/60">
            Leblanc &nbsp;·&nbsp; Taxi&nbsp;Leblanc
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Masthead grid */}
        <div className="mb-20 grid grid-cols-12 items-end gap-6 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 md:col-span-5"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-primary/70" />
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] text-primary">
                Nos caractéristiques
              </span>
            </div>
            <p className="font-sans text-sm leading-relaxed text-on-surface-dim max-w-sm">
              Trois engagements qui traversent chaque course, quelle qu&apos;elle soit, quelle que soit l&apos;heure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="col-span-12 md:col-span-7"
          >
            <h2 className="font-serif text-5xl leading-[0.95] text-on-surface sm:text-6xl md:text-right md:text-7xl lg:text-[88px]">
              Au service
              <br />
              <em className="text-primary">de l&apos;exigence</em>
              <br />
              <em className="not-italic text-on-surface/60">française.</em>
            </h2>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-px bg-on-surface/10 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.article
              key={item.roman}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.35 + i * 0.15,
              }}
              className="group relative flex min-h-[420px] flex-col justify-between bg-surface p-8 pt-10 transition-colors duration-500 hover:bg-background md:p-10 md:pt-12"
            >
              {/* Top gold hairline that grows */}
              <span
                aria-hidden
                className="absolute left-0 right-0 top-0 h-px origin-left scale-x-[0.15] bg-primary/70 transition-transform duration-700 ease-out group-hover:scale-x-100"
              />

              {/* Top row: Roman numeral + kicker */}
              <div>
                <div className="mb-10 flex items-start justify-between">
                  <span className="font-serif text-[84px] italic leading-none text-primary/80 transition-transform duration-700 ease-out group-hover:-translate-y-1">
                    {item.roman}
                  </span>
                  <div className="pt-6 text-right">
                    <span className="block text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-on-surface-dim">
                      {item.kicker}
                    </span>
                    <span
                      aria-hidden
                      className="mt-3 ml-auto block h-[3px] w-[3px] rounded-full bg-primary transition-all duration-500 group-hover:w-6"
                    />
                  </div>
                </div>

                <h3 className="font-serif text-[44px] italic leading-[0.95] text-on-surface md:text-5xl">
                  {item.title}
                </h3>
              </div>

              <div className="mt-10">
                <p className="font-sans text-[15px] leading-relaxed text-on-surface-dim">
                  {item.description}
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-on-surface-dim/60">
                    — Leblanc
                  </span>
                  <span className="font-serif text-xs italic text-primary/60">TL</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
