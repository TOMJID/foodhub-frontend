"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FEATURED = [
  {
    name: "The Iron Pantry",
    type: "Modern European",
    rating: 4.9,
    reviews: 247,
    time: "30-45 min",
    location: "Downtown",
    tags: ["Fine Dining", "Seasonal"],
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Saffron & Stone",
    type: "Persian Fusion",
    rating: 4.8,
    reviews: 189,
    time: "40-55 min",
    location: "Midtown",
    tags: ["Vegan Friendly", "Signature Spices"],
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
  },
];

export function FeaturedRestaurants() {
  return (
    <section className='py-24 px-6 bg-cream relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-brand rotate-45 -translate-x-1/2 -translate-y-1/2'></div>
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-charcoal rotate-12 translate-x-1/2 translate-y-1/2'></div>
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16 space-y-4'>
          <Badge
            variant='outline'
            className='border-charcoal border-2 text-charcoal font-black uppercase text-xs'>
            Recommended
          </Badge>
          <h2 className='text-5xl md:text-6xl font-serif font-black tracking-tighter text-charcoal'>
            Featured Restaurants
          </h2>
          <p className='text-gray-600 font-medium text-lg max-w-2xl mx-auto'>
            Handpicked culinary destinations offering exceptional dining
            experiences
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {FEATURED.map((provider, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className='flex flex-col bg-white border-[3px] border-charcoal shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] hover:shadow-[16px_16px_0px_0px_rgba(255,87,34,1)] transition-all group'>
              {/* Image Section */}
              <div className='relative h-[300px] overflow-hidden border-b-[3px] border-charcoal'>
                <Image
                  src={provider.img}
                  alt={provider.name}
                  fill
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                {/* Overlay Badge */}
                <div className='absolute top-4 left-4 bg-brand text-white px-4 py-2 font-black uppercase text-xs border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
                  Featured
                </div>
              </div>

              {/* Content Section */}
              <div className='p-8 space-y-6 flex flex-col grow'>
                {/* Header */}
                <div>
                  <div className='flex justify-between items-start mb-3'>
                    <span className='text-xs font-black text-brand uppercase tracking-widest'>
                      {provider.type}
                    </span>
                    <div className='flex items-center gap-1 bg-charcoal text-cream text-xs font-black px-3 py-1.5'>
                      <Star className='size-3 fill-brand text-brand' />
                      {provider.rating}
                      <span className='text-[10px] text-cream/60 ml-1'>
                        ({provider.reviews})
                      </span>
                    </div>
                  </div>
                  <h3 className='text-3xl font-serif font-black text-charcoal leading-none mb-4'>
                    {provider.name}
                  </h3>

                  {/* Tags */}
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {provider.tags.map((tag) => (
                      <span
                        key={tag}
                        className='text-[10px] font-bold border-charcoal border-2 px-2 py-1 uppercase'>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info Row */}
                <div className='flex items-center gap-4 text-sm font-bold text-gray-600 pt-4 border-t-2 border-charcoal/10'>
                  <div className='flex items-center gap-1.5'>
                    <Clock className='size-4 text-brand' />
                    <span>{provider.time}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <MapPin className='size-4 text-brand' />
                    <span>{provider.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className='mt-20 text-center'>
          <Link href='/restaurants'>
            <Button
              size='lg'
              variant='ghost'
              className='text-xl font-black hover:bg-transparent hover:text-brand group border-b-4 border-transparent hover:border-brand rounded-none px-8'>
              See all restaurants
              <ArrowRight className='ml-2 size-5 group-hover:translate-x-2 transition-transform' />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
