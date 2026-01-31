"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Utensils,
  Star,
  ArrowRight,
  Store,
  ChefHat,
  Pizza,
  Beef,
  Soup,
  Salad,
} from "lucide-react";
import Link from "next/link";

interface ProviderCardProps {
  id: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl?: string | null;
}

const ProviderIllustration = ({ id }: { id: string }) => {
  const icons = [Store, ChefHat, Pizza, Beef, Soup, Salad, Utensils];

  // Use id for deterministic random icon
  const iconIndex = id
    ? id
        .split("")
        .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) %
      icons.length
    : 0;
  const Icon = icons[iconIndex];

  return (
    <div className='w-full h-full bg-cream flex items-center justify-center relative overflow-hidden'>
      <div
        className='absolute inset-0 opacity-[0.05] pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0a0a0a 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className='relative z-10 size-20 bg-white border-4 border-charcoal flex items-center justify-center -rotate-2 shadow-[6px_6px_0px_0px_rgba(255,87,34,1)] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500'>
        <Icon className='size-10 text-brand' strokeWidth={2} />
      </div>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 border-2 border-charcoal/5 rounded-full' />
    </div>
  );
};

export function ProviderCard({
  id,
  restaurantName,
  cuisineType,
  address,
  coverImageUrl,
}: ProviderCardProps) {
  return (
    <Card className='group overflow-hidden rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(255,87,34,1)]'>
      <div className='relative h-48 overflow-hidden border-b-4 border-charcoal'>
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={restaurantName}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-110'
          />
        ) : (
          <ProviderIllustration id={id} />
        )}
        <div className='absolute top-4 left-4'>
          <Badge className='rounded-none bg-brand text-white border-2 border-charcoal px-3 py-1 font-black uppercase text-[8px] tracking-widest shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
            {cuisineType}
          </Badge>
        </div>
      </div>

      <CardContent className='p-5 space-y-4'>
        <div>
          <h3 className='text-xl font-serif font-black text-charcoal leading-tight uppercase tracking-tight'>
            {restaurantName}
          </h3>
          <div className='flex items-center gap-1.5 mt-2 text-gray-500'>
            <MapPin className='size-3 text-brand shrink-0' />
            <p className='text-[10px] font-bold uppercase tracking-widest truncate'>
              {address}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Star className='size-3 text-brand fill-brand' />
            <span className='text-[10px] font-black text-charcoal uppercase'>
              4.9
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <Utensils className='size-3 text-brand' />
            <span className='text-[10px] font-black text-charcoal uppercase'>
              20+ Meals
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='px-5 pb-5 pt-0'>
        <Button
          asChild
          className='w-full bg-white text-charcoal rounded-none border-2 border-charcoal hover:bg-charcoal hover:text-white font-black uppercase tracking-widest text-[10px] h-10 transition-all group/btn'>
          <Link
            href={`/restaurants/${id}`}
            className='flex items-center justify-center gap-2'>
            View Restaurant
            <ArrowRight className='size-3 group-hover/btn:translate-x-1 transition-transform' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
