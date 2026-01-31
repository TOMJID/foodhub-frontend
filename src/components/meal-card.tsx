"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Star,
  Eye,
  Utensils,
  Pizza,
  Soup,
  Beef,
  Coffee,
  IceCream,
  Cookie,
  Cake,
  Flame,
  ChefHat,
  Salad,
  Sandwich,
  Croissant,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { toast } from "react-hot-toast";

const MealIllustration = ({ id }: { id: string }) => {
  const icons = [
    Pizza,
    Soup,
    Beef,
    Coffee,
    IceCream,
    Cookie,
    Cake,
    Flame,
    ChefHat,
    Salad,
    Sandwich,
    Croissant,
    Utensils,
  ];

  // Use id to pick a deterministic "random" icon
  const iconIndex = id
    ? id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      icons.length
    : 0;
  const Icon = icons[iconIndex];

  return (
    <div className='w-full h-full bg-cream flex items-center justify-center relative overflow-hidden'>
      {/* --- Decorative Patterns --- */}
      <div
        className='absolute inset-0 opacity-[0.03] pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0a0a0a 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className='relative z-10 size-24 bg-white border-4 border-charcoal flex items-center justify-center rotate-3 shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] group-hover:rotate-0 group-hover:scale-110 transition-all duration-500'>
        <Icon className='size-12 text-brand' strokeWidth={2.5} />
      </div>

      {/* --- Abstract Shapes --- */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 border-4 border-charcoal/5 rounded-full rotate-45' />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-56 border-2 border-charcoal/5 rounded-full -rotate-12' />
    </div>
  );
};

interface MealCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  category?: string;
  providerName?: string;
  providerId: string;
}

export function MealCard({
  id,
  name,
  price,
  imageUrl,
  description,
  category,
  providerName,
  providerId,
}: MealCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      imageUrl,
      restaurantId: providerId,
      restaurantName: providerName,
    });
    toast.success(`${name} added to cart!`, {
      icon: "🍱",
      style: {
        border: "3px solid #0a0a0a",
        padding: "16px",
        color: "#0a0a0a",
        fontWeight: "900",
        textTransform: "uppercase",
        borderRadius: "0",
        background: "#fff",
        boxShadow: "8px 8px 0px 0px rgba(255,87,34,1)",
      },
      duration: 2000,
    });
  };
  return (
    <Card className='group overflow-hidden rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(255,87,34,1)]'>
      <div className='relative aspect-square overflow-hidden border-b-4 border-charcoal group'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-110'
          />
        ) : (
          <MealIllustration id={id} />
        )}
        <div className='absolute top-3 left-3 flex flex-col gap-2'>
          {category && (
            <Badge className='w-fit rounded-none border-2 border-charcoal bg-white text-charcoal px-2 py-0.5 text-[8px] font-black uppercase tracking-widest'>
              {category}
            </Badge>
          )}
        </div>
        <div className='absolute bottom-3 right-3 opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0'>
          <Button
            size='sm'
            onClick={handleAddToCart}
            className='h-10 w-10 rounded-none border-2 border-charcoal bg-brand p-0 hover:bg-black shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'>
            <Plus className='size-5 text-white' />
          </Button>
        </div>
      </div>

      <CardContent className='p-4 space-y-2'>
        <div className='flex justify-between items-start gap-2'>
          <h3 className='text-lg font-serif font-black text-charcoal leading-tight uppercase tracking-tight'>
            {name}
          </h3>
          <span className='shrink-0 text-lg font-black text-brand'>
            ${Number(price).toFixed(2)}
          </span>
        </div>

        {providerName && (
          <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1'>
            <span>By</span>
            <span className='text-charcoal font-black'>{providerName}</span>
          </p>
        )}

        {description && (
          <p className='text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed'>
            {description}
          </p>
        )}
      </CardContent>

      <CardFooter className='px-4 pb-4 pt-0 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-1 shrink-0'>
          <Star className='size-3 text-brand fill-brand' />
          <span className='text-[10px] font-black text-charcoal'>4.8</span>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            asChild
            variant='outline'
            size='sm'
            className='h-8 rounded-none border-2 border-charcoal bg-white px-3 text-[8px] font-black uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all'>
            <Link href={`/meals/${id}`}>
              <Eye className='mr-1.5 size-3' />
              Details
            </Link>
          </Button>
          <Badge className='rounded-none bg-cream border-2 border-charcoal text-charcoal px-2 py-0 border-none text-[8px] font-black uppercase hidden sm:block'>
            Featured
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
