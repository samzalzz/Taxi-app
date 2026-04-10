'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

type Entry = {
  numeral: string;
  kicker: string;
  title: string;
  lines: string[];
  action?: { label: string; href: string };
};

const ENTRIES: Entry[] = [
  {
    numeral: 'I',
    kicker: 'Leblanc',
    title: 'Adresse',
    lines: ['30 Allée des Bergeries', 'Draveil · 91210 · France'],
  },
  {
    numeral: 'II',
    kicker: 'Les heures',
    title: 'Disponibilité',
    lines: ['Lundi — Dimanche', 'Vingt-quatre heures sur vingt-quatre'],
  },
  {
    numeral: 'III',
    kicker: 'La ligne',
    title: 'Téléphone',
    lines: ['+33 6 08 55 03 15', "Réponse immédiate, à toute heure"],
    action: { label: 'Composer', href: 'tel:+33608550315' },
  },
];

export function ContactEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-28 px-6 md:py-36 lg:px-12"
    >
      {/* Subtle grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Rotated rail label */}
      <div className="pointer-events-none absolute left-4 top-0 bottom-0 hidden lg:flex items-center">
        <div className="origin-left -rotate-90 whitespace-nowrap translate-x-3">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.45em] text-primary/60">
            Prendre&nbsp;contact &nbsp;·&nbsp; Sur&nbsp;rendez&#8209;vous &nbsp;·&nbsp; Sans&nbsp;rendez&#8209;vous
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Masthead */}
        <div className="mb-20 grid grid-cols-12 items-end gap-6 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 md:col-span-7"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-primary/70" />
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] text-primary">
                Correspondance
              </span>
            </div>
            <h2 className="font-serif text-5xl leading-[0.92] text-on-surface sm:text-6xl md:text-7xl lg:text-[96px]">
              Une question ?
              <br />
              <em className="text-primary">Écrivez-nous.</em>
              <br />
              <em className="not-italic text-on-surface/60">Appelez-nous.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="col-span-12 md:col-span-5 md:pb-6"
          >
            <p className="font-sans text-sm leading-relaxed text-on-surface-dim md:max-w-sm md:text-right md:ml-auto">
              Précisez le lieu, l&apos;heure et la destination. La réponse viendra dans la minute — car rien n&apos;attend, et surtout pas vous.
            </p>
          </motion.div>
        </div>

        {/* Entries + reservation card */}
        <div className="grid grid-cols-1 gap-px bg-on-surface/10 lg:grid-cols-12">
          {/* Left column: three entries stacked */}
          <div className="relative bg-background lg:col-span-7">
            {ENTRIES.map((entry, i) => (
              <motion.div
                key={entry.numeral}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.35 + i * 0.12,
                }}
                className={`group relative grid grid-cols-12 items-start gap-6 px-2 py-10 md:px-6 md:py-12 ${
                  i > 0 ? 'border-t border-on-surface/10' : ''
                }`}
              >
                {/* Hover gold pool */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Numeral */}
                <div className="col-span-2">
                  <span className="block font-serif text-5xl italic leading-none text-primary/80 transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-6xl">
                    {entry.numeral}
                  </span>
                </div>

                {/* Content */}
                <div className="col-span-10 md:col-span-7">
                  <p className="mb-2 text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-on-surface-dim">
                    {entry.kicker}
                  </p>
                  <h3 className="mb-4 font-serif text-2xl italic leading-tight text-on-surface md:text-3xl">
                    {entry.title}
                  </h3>
                  {entry.lines.map((line, li) => (
                    <p
                      key={li}
                      className={`font-sans text-[14px] leading-relaxed ${
                        li === 0 ? 'text-on-surface' : 'text-on-surface-dim'
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Action */}
                {entry.action && (
                  <div className="col-span-12 md:col-span-3 md:pt-8">
                    <a
                      href={entry.action.href}
                      className="group/act inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-on-surface-dim transition-colors hover:text-primary"
                    >
                      {entry.action.label}
                      <svg
                        className="h-px w-10 transition-all duration-500 group-hover/act:w-16"
                        viewBox="0 0 40 1"
                        preserveAspectRatio="none"
                      >
                        <line x1="0" y1="0.5" x2="40" y2="0.5" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right column: reservation card */}
          <motion.aside
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            className="relative flex flex-col justify-between bg-surface p-8 md:p-12 lg:col-span-5"
          >
            {/* Top hairline */}
            <span aria-hidden className="absolute left-0 right-0 top-0 h-px bg-primary/60" />

            <div>
              <div className="mb-8 flex items-center justify-between">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-primary">
                  Réservation
                </span>
                <span className="font-serif text-xs italic text-primary/60">N&deg; IV</span>
              </div>

              <h3 className="mb-6 font-serif text-4xl italic leading-[0.95] text-on-surface md:text-5xl">
                Votre course,
                <br />
                <em className="not-italic text-primary">en un geste.</em>
              </h3>

              <p className="mb-10 font-sans text-[14px] leading-relaxed text-on-surface-dim">
                Renseignez votre trajet en quelques secondes. Nous confirmons dans la foulée, avec le véhicule et le chauffeur qu&apos;il vous faut.
              </p>
            </div>

            <div className="space-y-4">
              {/* Primary: call */}
              <a
                href="tel:+33608550315"
                className="group/cta flex items-center justify-between border-t border-b border-primary py-4 transition-colors hover:bg-primary hover:text-background"
              >
                <span className="font-serif text-lg italic">+33 6 08 55 03 15</span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em]">
                  Appeler
                </span>
              </a>

              {/* Secondary: reservation form */}
              <Link
                href="/reserver"
                className="group/res flex items-center justify-between py-4 text-on-surface transition-colors hover:text-primary"
              >
                <span className="font-serif text-lg italic">Réserver en ligne</span>
                <svg
                  className="h-px w-12 bg-current transition-all duration-500 group-hover/res:w-20"
                  viewBox="0 0 48 1"
                  preserveAspectRatio="none"
                >
                  <line x1="0" y1="0.5" x2="48" y2="0.5" stroke="currentColor" strokeWidth="1" />
                </svg>
              </Link>

              {/* Tertiary: email */}
              <a
                href="mailto:TaxiLeblanc@gmail.com"
                className="group/mail flex items-center justify-between py-4 text-on-surface-dim transition-colors hover:text-primary"
              >
                <span className="font-sans text-sm">TaxiLeblanc@gmail.com</span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em]">
                  Écrire
                </span>
              </a>
            </div>

            {/* Bottom monogram */}
            <div className="mt-12 flex items-center justify-between">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-on-surface-dim/60">
                Leblanc
              </span>
              <span className="font-serif text-sm italic text-primary/60">TL</span>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
