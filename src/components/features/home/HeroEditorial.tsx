'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const EASE = [0.22, 1, 0.36, 1] as const;

const SUMMARY = [
  { num: 'I', label: 'Notre partenariat', href: '#partenaire' },
  { num: 'II', label: 'Six années en bref', href: '#chiffres' },
  { num: 'III', label: 'Nos services', href: '#services' },
  { num: 'IV', label: 'Nos caractéristiques', href: '#maison' },
  { num: 'V', label: 'Correspondance', href: '#contact' },
];

export function HeroEditorial() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background image + layered washes */}
      <div
        aria-hidden
        className="absolute inset-0 scale-105 bg-cover bg-center blur-md"
        style={{ backgroundImage: 'url("/images/taxi-hero.avif")' }}
      />
      <div aria-hidden className="absolute inset-0 bg-background/80" />
      <div aria-hidden className="absolute inset-0 bg-black/40" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.10) 0%, transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(0,0,0,0.5) 0%, transparent 60%)',
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        style={{ transformOrigin: 'left' }}
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-primary/70 via-on-surface/20 to-transparent"
      />

      {/* Masthead top bar */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 pt-24 md:px-12 md:pt-28 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-10 bg-primary/70" />
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.4em] text-primary">
            Leblanc &middot; Île-de-France
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
          className="hidden items-center gap-4 md:flex"
        >
          <span className="font-serif text-xs italic text-primary/60">N&deg; I — MMXXVI</span>
          <span className="h-px w-10 bg-primary/70" />
        </motion.div>
      </div>

      {/* Main grid */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:gap-10">
        {/* Left: Kicker + giant headline */}
        <div className="col-span-12 lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            className="mb-8 flex items-center gap-4"
          >
            <span className="font-serif text-sm italic text-primary/80">i.</span>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] text-on-surface-dim">
              Le voyage, dressé avec soin
            </span>
          </motion.div>

          <h1 className="font-serif text-[56px] leading-[0.88] text-on-surface sm:text-7xl md:text-[104px] lg:text-[132px]">
            <HeroLine delay={0.7}>
              <span className="not-italic">Votre</span>
            </HeroLine>
            <HeroLine delay={0.82}>
              <em className="text-primary">course,</em>
            </HeroLine>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.25 }}
            style={{ transformOrigin: 'left' }}
            className="mt-10 h-px w-40 bg-primary/70 md:mt-14 md:w-56"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.35 }}
            className="mt-8 max-w-xl font-sans text-base leading-relaxed text-on-surface-dim md:text-[17px]"
          >
            Transferts d&apos;aéroport, trajets conventionnés et occasions marquantes&nbsp;: Leblanc compose chaque course avec la tenue d&apos;une grande maison. Vingt-quatre heures sur vingt-quatre, en Île-de-France.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.5 }}
            className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center md:mt-14"
          >
            <Link
              href="/reserver"
              className="group/cta inline-flex items-center justify-between gap-6 border-t border-b border-primary px-6 py-4 transition-colors hover:bg-primary hover:text-background sm:min-w-[280px]"
            >
              <span className="font-serif text-lg italic">Réserver une course</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em]">
                &rarr;
              </span>
            </Link>

            <a
              href="tel:+33608550315"
              className="group/tel inline-flex items-center gap-4 text-on-surface transition-colors hover:text-primary"
            >
              <span className="font-serif text-lg italic">+33 6 08 55 03 15</span>
              <svg
                className="h-px w-12 bg-current transition-all duration-500 group-hover/tel:w-20"
                viewBox="0 0 48 1"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="0.5" x2="48" y2="0.5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Right: Editorial table of contents */}
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          className="col-span-12 flex flex-col justify-end lg:col-span-4"
        >
          <div className="relative border-l border-primary/40 pl-6 md:pl-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-serif text-xs italic text-primary/70">ii.</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-on-surface-dim">
                Sommaire
              </span>
            </div>

            <ol className="divide-y divide-on-surface/10">
              {SUMMARY.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group/toc flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-primary"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-sans text-[10px] font-semibold text-primary/70">
                        {item.num}
                      </span>
                      <span className="font-serif text-lg italic text-on-surface transition-colors group-hover/toc:text-primary md:text-xl">
                        {item.label}
                      </span>
                    </span>
                    <svg
                      className="h-px w-8 bg-on-surface/40 transition-all duration-500 group-hover/toc:w-14 group-hover/toc:bg-primary"
                      viewBox="0 0 32 1"
                      preserveAspectRatio="none"
                    >
                      <line x1="0" y1="0.5" x2="32" y2="0.5" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </a>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden className="block h-[3px] w-[3px] rounded-full bg-primary" />
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-on-surface-dim">
                Draveil &middot; Paris &middot; CDG &middot; Orly
              </span>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Bottom rule + ticker */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.3 }}
          style={{ transformOrigin: 'right' }}
          className="h-px w-full bg-gradient-to-l from-primary/70 via-on-surface/20 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 md:px-12"
        >
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.35em] text-on-surface-dim">
            Depuis MMXX
          </span>
          <span className="hidden font-serif text-xs italic text-on-surface-dim md:inline">
            Vingt-quatre heures, sept jours
          </span>
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.35em] text-primary/70">
            Leblanc &mdash; TL
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function HeroLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, ease: EASE, delay }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
