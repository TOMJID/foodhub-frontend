"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Store,
  Star,
  Utensils,
  ChevronRight,
  Info,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MealCard } from "@/components/meal-card";
import { CartSheet } from "@/components/cart-sheet";

interface Meal {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  category: { name: string } | null;
}

interface Provider {
  id: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl: string | null;
  meals: Meal[];
}

const ProviderHeroIllustration = () => {
  return (
    <div className='w-full h-full bg-cream flex items-center justify-center relative overflow-hidden'>
      <div
        className='absolute inset-0 opacity-[0.05] pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0a0a0a 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className='relative z-10 space-y-4 text-center'>
        <div className='size-32 bg-white border-4 border-charcoal flex items-center justify-center rotate-3 shadow-[12px_12px_0px_0px_rgba(255,87,34,1)] mx-auto'>
          <Store className='size-16 text-brand' strokeWidth={2.5} />
        </div>
        <p className='text-[10px] font-black uppercase tracking-[0.5em] text-charcoal/20'>
          Culinary Hub
        </p>
      </div>
    </div>
  );
};

export default function ProviderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`/api/providers/${id}`);
        const json = await response.json();
        if (json.success) {
          setProvider(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch provider:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProvider();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-cream'>
        <LoadingSpinner
          text='Locating the kitchen...'
          size='xl'
          className='h-screen'
        />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className='min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center gap-8'>
        <div className='size-32 bg-white border-4 border-charcoal flex items-center justify-center -rotate-6 shadow-[10px_10px_0px_0px_rgba(10,10,10,1)]'>
          <Info className='size-16 text-brand' />
        </div>
        <h1 className='text-4xl font-serif font-black uppercase tracking-tighter'>
          Kitchen Closed
        </h1>
        <Button
          asChild
          className='bg-brand text-white font-black uppercase tracking-widest rounded-none border-2 border-charcoal px-8 py-6 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] hover:bg-black transition-all'>
          <Link href='/restaurants'>Browse Other Restaurants</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-cream'>
      {/* --- Sticky Header --- */}
      <header className='bg-white border-b-4 border-charcoal sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <Button
            onClick={() => router.back()}
            variant='ghost'
            className='group font-black uppercase tracking-widest text-xs flex items-center gap-2 px-0 hover:bg-transparent'>
            <div className='size-10 border-2 border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all'>
              <ChevronLeft className='size-5' />
            </div>
            Back
          </Button>

          <div className='flex items-center gap-4'>
            <Badge className='bg-charcoal text-white rounded-none font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1.5'>
              {provider.cuisineType}
            </Badge>
            <CartSheet />
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 py-12'>
        {/* --- Hero Section --- */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20'>
          <div className='lg:col-span-12'>
            <div className='relative h-[300px] md:h-[400px] border-[6px] border-charcoal bg-white shadow-[16px_16px_0px_0px_rgba(255,87,34,1)] overflow-hidden'>
              {provider.coverImageUrl ? (
                <Image
                  src={provider.coverImageUrl}
                  alt={provider.restaurantName}
                  fill
                  className='object-cover'
                />
              ) : (
                <ProviderHeroIllustration />
              )}

              {/* --- Floating Info Overlay --- */}
              <div className='absolute bottom-8 left-8 right-8 md:right-auto bg-white border-4 border-charcoal p-6 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
                <p className='text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-1'>
                  Premier Kitchen
                </p>
                <h1 className='text-4xl md:text-6xl font-serif font-black text-charcoal tracking-tighter uppercase italic leading-[0.9]'>
                  {provider.restaurantName}
                </h1>
                <div className='flex flex-wrap items-center gap-6 mt-4'>
                  <div className='flex items-center gap-1.5'>
                    <MapPin className='size-4 text-brand' />
                    <span className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                      {provider.address}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Star className='size-4 text-brand fill-brand' />
                    <span className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                      4.9 (500+ Reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section Header --- */}
        <div className='flex items-center justify-between mb-12'>
          <div className='space-y-1'>
            <h2 className='text-4xl font-serif font-black text-charcoal tracking-tighter uppercase italic'>
              The <span className='text-brand not-italic'>Menu.</span>
            </h2>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
              Handcrafted meals available for order
            </p>
          </div>
          <div className='flex items-center gap-2 text-[10px] font-black uppercase text-charcoal/30'>
            <Link
              href='/restaurants'
              className='hover:text-charcoal transition-colors underline decoration-brand decoration-2 underline-offset-4'>
              Restaurants
            </Link>
            <ChevronRight className='size-3' />
            <span className='text-charcoal'>{provider.restaurantName}</span>
          </div>
        </div>

        {/* --- Meals Grid --- */}
        {provider.meals && provider.meals.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {provider.meals.map((meal) => (
              <MealCard
                key={meal.id}
                id={meal.id}
                name={meal.name}
                price={Number(meal.price)}
                imageUrl={meal.imageUrl}
                description={meal.description}
                category={meal.category?.name}
                providerName={provider.restaurantName}
                providerId={provider.id}
              />
            ))}
          </div>
        ) : (
          <div className='py-24 text-center border-4 border-charcoal border-dashed bg-white'>
            <div className='size-20 bg-cream border-2 border-charcoal rotate-6 flex items-center justify-center mx-auto mb-6'>
              <Utensils className='size-10 text-brand' />
            </div>
            <h3 className='text-2xl font-serif font-black text-charcoal uppercase italic'>
              Menu currently empty
            </h3>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mt-2'>
              Check back soon for new delicious offerings.
            </p>
          </div>
        )}
      </main>

      {/* --- Footer Spacing --- */}
      <footer className='py-20' />
    </div>
  );
}
