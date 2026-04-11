'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type Avis = {
  index: string;
  name: string;
  role?: string;
  date: string;
  rating: number;
  text: string;
};

const AVIS: Avis[] = [
  {
    index: '01',
    name: 'Youssef Sayem',
    date: 'Mars 2026',
    rating: 5,
    text: "Franchement au top ! Taxi ponctuel, professionnel, conduite agréable. Je recommande fortement.",
  },
  {
    index: '02',
    name: 'Fatna Boukli',
    role: 'Local Guide',
    date: 'Décembre 2025',
    rating: 5,
    text:
      "Le chauffeur est bienveillant, à l'écoute et d'une grande gentillesse — on se sent en confiance dès les premières minutes. Je recommande les yeux fermés pour toute personne ayant besoin d'un taxi conventionné sérieux et humain.",
  },
  {
    index: '03',
    name: 'Adam Ouatman',
    date: 'Avril 2026',
    rating: 5,
    text:
      "Un monsieur très chaleureux et accueillant, mon trajet a été réalisé avec succès dans un confort incroyable à Ivry-sur-Seine. Je vous conseille fortement.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < count ? 'fill-primary' : 'fill-primary/20'}`}
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1z" />
        </svg>
      ))}
    </div>
  );
}

export function AvisEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px -15% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-b border-primary/20 bg-background py-28 px-6 md:py-36 lg:px-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(245deg,rgba(212,175,55,0.05)_0%,transparent_40%,transparent_60%,rgba(212,175,55,0.04)_100%)]"
      />

      <div className="pointer-events-none absolute left-6 top-6 hidden items-center gap-3 md:flex">
        <span className="h-px w-8 bg-primary/50" />
        <span className="font-serif text-xs italic text-primary/60">Paroles de clients</span>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 hidden items-center gap-3 md:flex">
        <span className="font-serif text-xs italic text-primary/60">5,0 · 31 avis Google</span>
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
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">
              Ce qu'ils en disent
            </span>
            <span className="h-px w-10 bg-primary/70" />
          </div>
          <h2 className="font-serif text-4xl leading-[0.95] text-on-surface sm:text-5xl md:text-6xl lg:text-7xl">
            La confiance se lit
            <br />
            <em className="text-primary">entre les lignes.</em>
          </h2>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Stars count={5} />
            <span className="font-serif text-sm italic text-on-surface-dim">
              5,0 sur 31 avis Google
            </span>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3 md:gap-x-12">
          {AVIS.map((avis, i) => (
            <motion.figure
              key={avis.index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3 + i * 0.18,
              }}
              className="group relative flex flex-col"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-serif text-sm italic text-primary/70">{avis.index}</span>
                <Stars count={avis.rating} />
              </div>

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

              <span
                aria-hidden
                className="mb-4 font-serif text-6xl leading-none text-primary/40"
              >
                &ldquo;
              </span>

              <blockquote className="mb-8 font-serif text-lg italic leading-relaxed text-on-surface md:text-xl">
                {avis.text}
              </blockquote>

              <figcaption className="mt-auto">
                <p className="font-serif text-base text-on-surface">{avis.name}</p>
                {avis.role && (
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-primary/70">
                    {avis.role}
                  </p>
                )}
                <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.2em] text-on-surface-dim">
                  {avis.date}
                </p>
              </figcaption>

              <div className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-[3px] w-[3px] rounded-full bg-primary transition-all duration-500 group-hover:w-8"
                />
                <span className="font-serif text-[10px] italic text-primary/60">Avis vérifié</span>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
