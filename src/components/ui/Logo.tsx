'use client';

import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
}

export function Logo({ href = '/', className = 'h-10 w-auto' }: LogoProps) {
  return (
    <Link href={href}>
      <img
        src="/images/logo.png"
        alt="Taxi Leblanc"
        className={`${className} hover:opacity-80 transition-opacity cursor-pointer`}
      />
    </Link>
  );
}
