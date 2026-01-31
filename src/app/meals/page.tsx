"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/meal-card";
import { CartSheet } from "@/components/cart-sheet";

interface Meal {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  category: { name: string } | null;
  provider: { id: string; restaurantName: string } | null;
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("/api/meals");
        const json = await response.json();
        if (json.success) {
          setMeals(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-cream'>
      {/* --- Simple Navigation --- */}
      <header className='bg-white border-b-4 border-charcoal sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <Link href='/' className='group'>
            <span className='text-3xl font-serif font-black tracking-tighter text-charcoal group-hover:text-brand transition-colors'>
              FOOD
              <span className='text-brand group-hover:text-charcoal transition-colors'>
                HUB
              </span>
            </span>
          </Link>

          <nav className='hidden md:flex items-center gap-8'>
            <Link
              href='/meals'
              className='text-xs font-black uppercase tracking-widest text-brand'>
              Browse Meals
            </Link>
            <Link
              href='/restaurants'
              className='text-xs font-black uppercase tracking-widest text-charcoal hover:text-brand transition-colors'>
              Restaurants
            </Link>
            <Link
              href='/account'
              className='text-xs font-black uppercase tracking-widest text-charcoal hover:text-brand transition-colors'>
              Account
            </Link>
            <CartSheet />
          </nav>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 py-16'>
        {/* --- Hero Section --- */}
        <div className='space-y-6 mb-16'>
          <div className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
            <Link href='/' className='hover:text-charcoal'>
              Home
            </Link>
            <ChevronRight className='size-3' />
            <span className='text-brand'>Browse Meals</span>
          </div>

          <h1 className='text-6xl md:text-8xl font-serif font-black text-charcoal leading-[0.9] tracking-tighter italic'>
            Chef&apos;s <br />
            <span className='text-brand not-italic'>Selection.</span>
          </h1>

          <p className='max-w-2xl text-lg font-medium text-gray-600 leading-relaxed'>
            Discover a curated collection of culinary masterpieces from
            top-rated kitchens. Sorted by flavor, crafted with passion.
          </p>
        </div>

        {/* --- Filter Bar --- */}
        <div className='flex flex-col md:row items-center gap-6 mb-12'>
          <div className='relative w-full md:grow'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400' />
            <Input
              type='text'
              placeholder='SEARCH FOR YOUR CRAVING...'
              className='h-16 pl-12 pr-6 border-4 border-charcoal bg-white rounded-none text-lg font-black placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:ring-4 uppercase tracking-tighter'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- Content --- */}
        {isLoading ? (
          <div className='py-40 flex flex-col items-center gap-6'>
            <Loader2 className='size-20 text-brand animate-spin' />
            <p className='text-xl font-black uppercase tracking-widest text-charcoal/30'>
              Waking up the chefs...
            </p>
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {filteredMeals.map((meal) => (
              <MealCard
                key={meal.id}
                id={meal.id}
                name={meal.name}
                price={Number(meal.price)}
                imageUrl={meal.imageUrl}
                description={meal.description}
                category={meal.category?.name || undefined}
                providerName={meal.provider?.restaurantName || undefined}
                providerId={meal.provider?.id || ""}
              />
            ))}
          </div>
        ) : (
          <div className='py-40 text-center space-y-8 bg-white border-8 border-charcoal border-dashed'>
            <div className='size-32 bg-cream border-4 border-charcoal border-dashed mx-auto flex items-center justify-center rotate-3'>
              <Search className='size-16 text-charcoal/10' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-4xl font-serif font-black text-charcoal tracking-tighter uppercase'>
                No flavor found
              </h2>
              <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>
                We couldn&apos;t find any results for &quot;{searchQuery}&quot;
              </p>
            </div>
            <Button
              onClick={() => setSearchQuery("")}
              className='bg-brand text-white font-black uppercase tracking-widest rounded-none border-2 border-charcoal px-8 py-4 hover:bg-black transition-all shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
              Clear Search
            </Button>
          </div>
        )}
      </main>

      {/* --- Simple Footer --- */}
      <footer className='bg-charcoal text-white pt-20 pb-12 border-t-8 border-brand'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex flex-col md:row items-center justify-between gap-12 mb-20'>
            <div className='space-y-4 text-center md:text-left'>
              <span className='text-5xl font-serif font-black tracking-tighter text-white'>
                FOOD<span className='text-brand'>HUB</span>
              </span>
              <p className='text-white/40 text-[10px] font-black uppercase tracking-[0.3em] max-w-sm'>
                Curating the world&apos;s finest culinary experiences, one order
                at a time.
              </p>
            </div>
            <div className='flex gap-12'>
              <div className='space-y-4'>
                <p className='text-[10px] font-black uppercase tracking-widest text-brand'>
                  Explore
                </p>
                <ul className='space-y-2 text-xs font-bold text-white/60'>
                  <li>
                    <Link
                      href='/meals'
                      className='hover:text-white transition-colors'>
                      Browse Meals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/restaurants'
                      className='hover:text-white transition-colors'>
                      Restaurants
                    </Link>
                  </li>
                </ul>
              </div>
              <div className='space-y-4'>
                <p className='text-[10px] font-black uppercase tracking-widest text-brand'>
                  Legal
                </p>
                <ul className='space-y-2 text-xs font-bold text-white/60'>
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
            </div>
          </div>

          <p className='text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/20'>
            © 2026 FOODHUB INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
