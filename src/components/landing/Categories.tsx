"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
  {
    name: "Artisan Pizza",
    img: "/images/pizza.png",
    count: "42 restaurants",
  },
  {
    name: "Gourmet Burgers",
    img: "/images/burger.png",
    count: "38 restaurants",
  },
  {
    name: "Premium Sushi",
    img: "/images/sushi.png",
    count: "25 restaurants",
  },
];

export function Categories() {
  return (
    <section className='bg-charcoal py-24 px-6 text-cream overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row items-end justify-between gap-8 mb-16'>
          <div className='space-y-4'>
            <span className='text-brand font-black uppercase tracking-[0.3em] text-sm'>
              Cuisine selection
            </span>
            <h2 className='text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none'>
              What are <br /> you craving?
            </h2>
          </div>
          <Link
            href='/meals'
            className='text-xl font-black border-b-[3px] border-brand pb-1 hover:text-brand transition-colors'>
            Explore All Menus →
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {CATEGORIES.map((category, idx) => (
            <Card
              key={idx}
              className='bg-transparent border-[3px] border-cream/20 rounded-none overflow-hidden group hover:border-brand transition-colors duration-500'>
              <CardContent className='p-0 relative aspect-square'>
                <Image
                  src={category.img}
                  alt={category.name}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100'
                />
                <div className='absolute inset-0 bg-linear-to-t from-charcoal via-transparent to-transparent opacity-60'></div>
                <div className='absolute bottom-0 left-0 p-8 w-full group-hover:translate-y-[-10px] transition-transform duration-500'>
                  <h3 className='text-3xl font-serif font-black text-white leading-none'>
                    {category.name}
                  </h3>
                  <p className='text-brand text-xs uppercase font-black tracking-widest mt-2'>
                    {category.count}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
