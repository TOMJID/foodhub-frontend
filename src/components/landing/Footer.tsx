"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className='bg-charcoal pt-24 pb-12 px-6 text-cream border-t-8 border-brand'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20'>
          <div className='lg:col-span-2 space-y-8'>
            <h2 className='text-4xl md:text-6xl font-serif font-black tracking-tighter text-white leading-none'>
              Ready to taste <br /> the{" "}
              <span className='text-brand underline decoration-[6px]'>
                extraordinary?
              </span>
            </h2>
          </div>

          <div className='grid grid-cols-2 lg:col-span-2 gap-12'>
            <div className='space-y-6'>
              <h4 className='text-brand font-black uppercase tracking-widest text-sm'>
                Navigation
              </h4>
              <ul className='space-y-3 font-bold'>
                <li>
                  <Link
                    href='/meals'
                    className='hover:text-brand transition-colors'>
                    Find Food
                  </Link>
                </li>
                <li>
                  <Link
                    href='/restaurants'
                    className='hover:text-brand transition-colors'>
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link
                    href='/become-provider'
                    className='hover:text-brand transition-colors'>
                    Start Selling
                  </Link>
                </li>
                <li>
                  <Link
                    href='/about'
                    className='hover:text-brand transition-colors'>
                    Our Story
                  </Link>
                </li>
              </ul>
            </div>
            <div className='space-y-6'>
              <h4 className='text-brand font-black uppercase tracking-widest text-sm'>
                Social
              </h4>
              <ul className='space-y-3 font-bold'>
                <li>
                  <a href='#' className='hover:text-brand transition-colors'>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-brand transition-colors'>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-brand transition-colors'>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-brand transition-colors'>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className='bg-cream/10 h-[2px] mb-12' />

        <div className='flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest text-cream/40'>
          <p>© 2026 FOODHUB INC. ALL RIGHTS RESERVED.</p>
          <div className='flex gap-8'>
            <Link
              href='/privacy'
              className='hover:text-white transition-colors'>
              Privacy Policy
            </Link>
            <Link href='/terms' className='hover:text-white transition-colors'>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
