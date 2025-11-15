'use client';

import React from "react";
import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='text-center px-4'>
        <span className='block text-[10rem] leading-none font-extrabold text-primary'>
          404
        </span>
        <h2 className='my-6 text-3xl font-bold text-foreground'>
          Something&apos;s missing
        </h2>
        <p className='mb-8 text-lg text-muted-foreground'>
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className='inline-block rounded-lg px-8 py-4 font-bold text-xl transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-orange-light'
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
