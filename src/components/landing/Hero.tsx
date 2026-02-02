"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className='px-6 pb-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
        <div className='lg:col-span-7 space-y-8'>
          <Badge className='bg-brand/10 text-brand border-none px-4 py-1 text-xs uppercase tracking-[0.2em] font-black'>
            Premium Food Delivery
          </Badge>
          <h1 className='text-6xl md:text-8xl font-serif font-black leading-[0.95] text-charcoal tracking-tighter'>
            Discover <br />
            <span className='text-brand'>Culinary</span> <br />
            Artistry.
          </h1>
          <p className='max-w-xl text-xl text-gray-600 font-medium leading-relaxed'>
            Connect with top-tier local providers and experience meals that
            transcend the ordinary. Every order is a curated journey of flavor
            and craft.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <Button
              size='lg'
              className='bg-brand hover:bg-brand-dark text-white text-lg font-black h-16 px-10 rounded-none border-[3px] border-charcoal shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(10,10,10,1)] active:translate-x-0 active:translate-y-0 active:shadow-none'>
              <Link href='/meals'>Order Now</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-[3px] border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-lg font-black h-16 px-10 rounded-none transition-all'>
              <Link href='/become-provider'>Join as Restaurant</Link>
            </Button>
          </div>
        </div>

        <div className='lg:col-span-5 relative group'>
          <div className='absolute inset-0 bg-brand translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500'></div>
          <div className='border-4 border-charcoal overflow-hidden aspect-4/5 relative'>
            <Image
              src='/images/hero.png'
              alt='High-end food bowl'
              fill
              sizes='(max-width: 1024px) 100vw, 40vw'
              className='object-cover group-hover:scale-105 transition-transform duration-700'
              priority
            />
          </div>
          <div className='absolute -bottom-10 -left-10 bg-white border-[3px] border-charcoal p-6 shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] hidden md:block'>
            <p className='font-serif italic text-2xl font-black text-charcoal'>
              &quot;The best meal I&apos;ve ever ordered online.&quot;
            </p>
            <p className='mt-2 text-xs uppercase tracking-widest font-black text-brand'>
              — Sarah J., Food Critic
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
