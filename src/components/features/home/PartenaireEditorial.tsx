'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

type Engagement = {
  num: string;
  title: string;
  body: string;
};

const ENGAGEMENTS: Engagement[] = [
  {
    num: '01',
    title: 'Ponctualité',
    body:
      'Un chauffeur qui devance la minute. Itinéraires étudiés, horaires tenus, trafic anticipé — vous partez à l\u2019heure dite.',
  },
  {
    num: '02',
    title: 'Confort',
    body:
      'Berlines récentes, habitacles irréprochables, climat soigné. Le trajet devient une parenthèse, non une contrainte.',
  },
  {
    num: '03',
    title: 'Sur mesure',
    body:
      'Chaque course se compose comme un plat : vos exigences, vos bagages, vos haltes. Rien d\u2019interchangeable.',
  },
  {
    num: '04',
    title: 'Tenue',
    body:
      'Des chauffeurs expérimentés, formés à la discrétion et à l\u2019accueil. La bonne parole au bon moment, ou le silence.',
  },
];

export function PartenaireEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-28 px-6 md:py-36 lg:px-12"
    >
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Corner marks */}
      <div className="pointer-events-none absolute left-6 top-6 hidden items-center gap-3 md:flex">
        <span className="font-serif text-xs italic text-primary/60">N&deg; 0</span>
        <span className="h-px w-8 bg-primary/50" />
      </div>
      <div className="pointer-events-none absolute right-6 top-6 hidden items-center gap-3 md:flex">
        <span className="h-px w-8 bg-primary/50" />
        <span className="font-serif text-xs italic text-primary/60">Préface</span>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Masthead */}
        <div className="mb-20 grid grid-cols-12 items-end gap-6 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="col-span-12 md:col-span-7"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-primary/70" />
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] text-primary">
                Votre partenaire de transport
              </span>
            </div>
            <h2 className="font-serif text-5xl leading-[0.92] text-on-surface sm:text-6xl md:text-7xl lg:text-[96px]">
              Une maison,
              <br />
              <em className="text-primary">quatre promesses</em>
              <br />
              <em className="not-italic text-on-surface/60">— et rien de moins.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="col-span-12 md:col-span-5 md:pb-6"
          >
            <p className="font-sans text-sm leading-relaxed text-on-surface-dim md:max-w-sm md:text-right md:ml-auto">
              Leblanc ne se contente pas de conduire&nbsp;: la maison compose chaque course avec la précision d&apos;un service de table. Aéroport, santé, cérémonie — mêmes exigences, même soin.
            </p>
          </motion.div>
        </div>

        {/* Engagements grid */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
          style={{ transformOrigin: 'left' }}
          className="mb-0 h-px w-full bg-gradient-to-r from-primary/60 via-on-surface/20 to-transparent"
        />

        <div className="grid grid-cols-1 gap-px bg-on-surface/10 sm:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENTS.map((eng, i) => (
            <motion.article
              key={eng.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.85,
                ease: EASE,
                delay: 0.4 + i * 0.12,
              }}
              className="group relative flex min-h-[320px] flex-col justify-between bg-background p-8 transition-colors duration-500 hover:bg-surface md:p-10"
            >
              {/* Growing top gold hairline */}
              <span
                aria-hidden
                className="absolute left-0 right-0 top-0 h-px origin-left scale-x-[0.15] bg-primary/70 transition-transform duration-700 ease-out group-hover:scale-x-100"
              />

              <div>
                <div className="mb-8 flex items-baseline justify-between">
                  <span className="font-serif text-5xl italic leading-none text-primary/80 transition-transform duration-500 ease-out group-hover:-translate-y-1 md:text-6xl">
                    {eng.num}
                  </span>
                  <span
                    aria-hidden
                    className="block h-[3px] w-[3px] rounded-full bg-primary transition-all duration-500 group-hover:w-8"
                  />
                </div>

                <h3 className="mb-4 font-serif text-3xl italic leading-[0.95] text-on-surface md:text-4xl">
                  {eng.title}
                </h3>
              </div>

              <p className="mt-6 font-sans text-[14px] leading-relaxed text-on-surface-dim">
                {eng.body}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Signature line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex items-center justify-between gap-6"
        >
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.35em] text-on-surface-dim">
            Une signature, quatre gestes
          </span>
          <span className="font-serif text-xs italic text-primary/60">Leblanc &middot; TL</span>
        </motion.div>
      </div>
    </section>
  );
}
