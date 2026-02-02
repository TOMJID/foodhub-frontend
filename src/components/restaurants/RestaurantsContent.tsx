"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Store } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProviderCard } from "@/components/provider-card";

interface Provider {
  id: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl?: string | null;
}

export function RestaurantsContent() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/providers");
        const json = await response.json();
        if (json.success) {
          setProviders(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(
    (p) =>
      p.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-cream'>
      {/* --- Navigation --- */}
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
              className='text-xs font-black uppercase tracking-widest text-charcoal hover:text-brand transition-colors'>
              Browse Meals
            </Link>
            <Link
              href='/restaurants'
              className='text-xs font-black uppercase tracking-widest text-brand'>
              Restaurants
            </Link>
            <Link
              href='/account'
              className='text-xs font-black uppercase tracking-widest text-charcoal hover:text-brand transition-colors'>
              Account
            </Link>
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
            <span className='text-brand'>Restaurants</span>
          </div>

          <h1 className='text-6xl md:text-8xl font-serif font-black text-charcoal leading-[0.9] tracking-tighter italic'>
            Local <br />
            <span className='text-brand not-italic'>Kitchens.</span>
          </h1>

          <p className='max-w-2xl text-lg font-medium text-gray-600 leading-relaxed'>
            From hidden gems to city favorites. Explore the best culinary hubs
            in your neighborhood, all in one place.
          </p>
        </div>

        {/* --- Search Bar --- */}
        <div className='flex items-center gap-6 mb-12'>
          <div className='relative w-full grow'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400' />
            <Input
              type='text'
              placeholder='SEARCH BY NAME OR CUISINE...'
              className='h-16 pl-12 pr-6 border-4 border-charcoal bg-white rounded-none text-lg font-black placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:ring-4 uppercase tracking-tighter'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Separator className='bg-charcoal/10 mb-12' />

        {/* --- Content --- */}
        {isLoading ? (
          <div className='py-40'>
            <LoadingSpinner text='Scouting the city...' size='lg' />
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                id={provider.id}
                restaurantName={provider.restaurantName}
                cuisineType={provider.cuisineType}
                address={provider.address}
                coverImageUrl={provider.coverImageUrl}
              />
            ))}
          </div>
        ) : (
          <div className='py-40 text-center space-y-8 bg-white border-8 border-charcoal border-dashed'>
            <div className='size-32 bg-cream border-4 border-charcoal border-dashed mx-auto flex items-center justify-center rotate-3'>
              <Store className='size-16 text-charcoal/10' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-4xl font-serif font-black text-charcoal tracking-tighter uppercase'>
                No kitchens found
              </h2>
              <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>
                We couldn&apos;t find any restaurants matching &quot;
                {searchQuery}&quot;
              </p>
            </div>
            <Button
              onClick={() => setSearchQuery("")}
              className='bg-brand text-white font-black uppercase tracking-widest rounded-none border-2 border-charcoal px-8 py-4 hover:bg-black transition-all shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
              Reset Search
            </Button>
          </div>
        )}
      </main>

      {/* --- Footer --- */}
      <footer className='bg-charcoal text-white pt-20 pb-12 border-t-8 border-brand'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex flex-col md:row items-center justify-between gap-12 mb-20'>
            <div className='space-y-4 text-center md:text-left'>
              <span className='text-5xl font-serif font-black tracking-tighter text-white'>
                FOOD<span className='text-brand'>HUB</span>
              </span>
              <p className='text-white/40 text-[10px] font-black uppercase tracking-[0.3em] max-w-sm'>
                Connecting food lovers with the finest culinary masters in the
                city.
              </p>
            </div>
            <div className='flex gap-12'>
              <div className='space-y-4'>
                <p className='text-[10px] font-black uppercase tracking-widest text-brand'>
                  Navigate
                </p>
                <ul className='space-y-2 text-xs font-bold text-white/60'>
                  <li>
                    <Link href='/meals' className='hover:text-white'>
                      Browse Meals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/restaurants'
                      className='hover:text-brand text-white'>
                      Restaurants
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className='bg-white/10 mb-8' />
          <p className='text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/20'>
            © 2026 FOODHUB INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
