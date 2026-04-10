'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

type Service = {
  index: string;
  title: string;
  meta: string;
  description: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Transferts aéroport',
    meta: 'CDG · Orly · Beauvais · Le Bourget',
    description:
      'Une course soignée vers tous les aéroports d\u2019Île-de-France. Devis instantané, suivi du vol, prise en charge bagages.',
    href: '/services/transport-aeroportuaire',
  },
  {
    index: '02',
    title: 'Transport médical',
    meta: 'Conventionné CPAM · Assis & allongé',
    description:
      'Courses médicales prises en charge, accompagnement discret et ponctualité exigée — pour consultations, dialyses, chimio.',
    href: '/services/transport-medical',
  },
  {
    index: '03',
    title: 'Occasions personnelles',
    meta: 'Réceptions · Soirées · Déplacements pro',
    description:
      'Un chauffeur attentif pour vos moments qui comptent. Véhicules premium, tenue impeccable, itinéraire étudié.',
    href: '/services/occasions-personnelles',
  },
];

export function ServicesEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-28 px-6 md:py-36 lg:px-12"
    >
      {/* Subtle grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vertical rotated label, left rail */}
      <div className="pointer-events-none absolute left-4 top-0 bottom-0 hidden lg:flex items-center">
        <div className="origin-left -rotate-90 whitespace-nowrap translate-x-3">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.45em] text-primary/60">
            Nos&nbsp;services  · &nbsp; Depuis&nbsp;2010
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 md:mb-28"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-primary/70" />
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] text-primary">
              Catalogue des prestations
            </span>
          </div>
          <h2 className="font-serif text-5xl leading-[0.95] text-on-surface sm:text-6xl md:text-7xl lg:text-[92px]">
            L&apos;art du transport,
            <br />
            <em className="not-italic text-on-surface/60">décliné en </em>
            <em className="text-primary">trois mouvements.</em>
          </h2>
        </motion.div>

        {/* Entries */}
        <ol className="relative">
          {/* top hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ transformOrigin: 'left' }}
            className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-primary/60 via-on-surface/20 to-transparent"
          />

          {SERVICES.map((s, i) => (
            <motion.li
              key={s.index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.35 + i * 0.12,
              }}
              className="group relative"
            >
              <Link href={s.href} className="block">
                <div className="relative grid grid-cols-12 items-start gap-6 py-10 md:py-14 transition-colors duration-500 group-hover:bg-primary/[0.025]">
                  {/* Hover gold pool */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Numeral */}
                  <div className="col-span-3 md:col-span-2">
                    <span className="block font-serif text-6xl italic text-primary/80 transition-transform duration-500 ease-out group-hover:translate-x-3 md:text-7xl lg:text-8xl">
                      {s.index}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="col-span-9 md:col-span-7">
                    <h3 className="font-serif text-3xl leading-tight text-on-surface md:text-4xl lg:text-5xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/80">
                      {s.meta}
                    </p>
                    <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-on-surface-dim md:text-base">
                      {s.description}
                    </p>
                  </div>

                  {/* Arrow column */}
                  <div className="col-span-12 md:col-span-3 md:pl-4">
                    <div className="flex items-center justify-start md:justify-end md:pt-6">
                      <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-on-surface-dim transition-colors duration-500 group-hover:text-primary">
                        Découvrir
                        <svg
                          className="h-px w-10 transition-all duration-500 group-hover:w-16"
                          viewBox="0 0 40 1"
                          preserveAspectRatio="none"
                        >
                          <line
                            x1="0"
                            y1="0.5"
                            x2="40"
                            y2="0.5"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Divider */}
              <div className="relative h-px w-full overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.55 + i * 0.12,
                  }}
                  style={{ transformOrigin: 'left' }}
                  className="absolute inset-0 bg-gradient-to-r from-on-surface/20 via-on-surface/10 to-transparent"
                />
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Footer flourish */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-16 flex items-center justify-between gap-6"
        >
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] text-on-surface-dim">
            Île-de-France &nbsp;·&nbsp; 24 h / 24
          </span>
          <Link
            href="/reserver"
            className="group/cta inline-flex items-center gap-4 text-[11px] font-sans font-semibold uppercase tracking-[0.35em] text-on-surface hover:text-primary transition-colors"
          >
            Réserver une course
            <span className="relative block h-px w-12 overflow-hidden bg-on-surface/30">
              <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 group-hover/cta:translate-x-0" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
