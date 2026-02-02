"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Filter, X } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MealCard } from "@/components/meal-card";
import { CartSheet } from "@/components/cart-sheet";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const filterPanelVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

interface Meal {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  category: { id: string; name: string } | null;
  provider: { id: string; restaurantName: string } | null;
}

interface Category {
  id: string;
  name: string;
}

export function MealsContent() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, categoriesRes] = await Promise.all([
          fetch("/api/meals"),
          fetch("/api/categories"),
        ]);

        const mealsJson = await mealsRes.json();
        const categoriesJson = await categoriesRes.json();

        if (mealsJson.success) {
          setMeals(mealsJson.data);
        }
        if (categoriesJson.success) {
          setCategories(categoriesJson.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMeals = meals.filter((meal) => {
    // Search filter
    const matchesSearch = meal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      !selectedCategory || meal.category?.id === selectedCategory;

    // Price range filter
    let matchesPrice = true;
    if (priceRange) {
      const price = Number(meal.price);
      if (priceRange === "under10") matchesPrice = price < 10;
      else if (priceRange === "10to20")
        matchesPrice = price >= 10 && price <= 20;
      else if (priceRange === "over20") matchesPrice = price > 20;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange;

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
        <div className='space-y-8 mb-12'>
          {/* Search */}
          <div className='relative w-full'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400' />
            <Input
              type='text'
              placeholder='SEARCH FOR YOUR CRAVING...'
              className='h-16 pl-12 pr-6 border-4 border-charcoal bg-white rounded-none text-lg font-black placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:ring-4 uppercase tracking-tighter'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category & Price Filters */}
          <motion.div
            variants={filterPanelVariants}
            initial='hidden'
            animate='visible'
            className='bg-white border-4 border-charcoal p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Filter className='size-5 text-brand' />
                <h3 className='text-sm font-black uppercase tracking-widest text-charcoal'>
                  Filter Results
                </h3>
              </div>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant='ghost'
                  size='sm'
                  className='font-black uppercase text-[10px] tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50'>
                  <X className='size-3 mr-1' />
                  Clear All
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className='space-y-3'>
              <label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
                Cuisine Type
              </label>
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 border-2 font-black uppercase text-xs tracking-wider transition-all ${
                    !selectedCategory
                      ? "bg-brand text-white border-brand shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                      : "bg-white text-charcoal border-charcoal hover:border-brand"
                  }`}>
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 border-2 font-black uppercase text-xs tracking-wider transition-all ${
                      selectedCategory === category.id
                        ? "bg-brand text-white border-brand shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                        : "bg-white text-charcoal border-charcoal hover:border-brand"
                    }`}>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filters */}
            <div className='space-y-3'>
              <label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
                Price Range
              </label>
              <div className='flex flex-wrap gap-2'>
                <button
                  onClick={() => setPriceRange(null)}
                  className={`px-4 py-2 border-2 font-black uppercase text-xs tracking-wider transition-all ${
                    !priceRange
                      ? "bg-brand text-white border-brand shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                      : "bg-white text-charcoal border-charcoal hover:border-brand"
                  }`}>
                  All Prices
                </button>
                <button
                  onClick={() => setPriceRange("under10")}
                  className={`px-4 py-2 border-2 font-black uppercase text-xs tracking-wider transition-all ${
                    priceRange === "under10"
                      ? "bg-brand text-white border-brand shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                      : "bg-white text-charcoal border-charcoal hover:border-brand"
                  }`}>
                  Under $10
                </button>
                <button
                  onClick={() => setPriceRange("10to20")}
                  className={`px-4 py-2 border-2 font-black uppercase text-xs tracking-wider transition-all ${
                    priceRange === "10to20"
                      ? "bg-brand text-white border-brand shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                      : "bg-white text-charcoal border-charcoal hover:border-brand"
                  }`}>
                  $10 - $20
                </button>
                <button
                  onClick={() => setPriceRange("over20")}
                  className={`px-4 py-2 border-2 font-black uppercase text-xs tracking-wider transition-all ${
                    priceRange === "over20"
                      ? "bg-brand text-white border-brand shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                      : "bg-white text-charcoal border-charcoal hover:border-brand"
                  }`}>
                  Over $20
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className='pt-4 border-t-2 border-charcoal/10'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3'>
                    Active Filters
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}>
                          <Badge className='bg-charcoal text-white rounded-none uppercase text-[8px] font-black px-3 py-1.5 border-2 border-charcoal'>
                            Search: &quot;{searchQuery}&quot;
                          </Badge>
                        </motion.div>
                      )}
                      {selectedCategory && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}>
                          <Badge className='bg-charcoal text-white rounded-none uppercase text-[8px] font-black px-3 py-1.5 border-2 border-charcoal'>
                            {
                              categories.find((c) => c.id === selectedCategory)
                                ?.name
                            }
                          </Badge>
                        </motion.div>
                      )}
                      {priceRange && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}>
                          <Badge className='bg-charcoal text-white rounded-none uppercase text-[8px] font-black px-3 py-1.5 border-2 border-charcoal'>
                            {priceRange === "under10" && "Under $10"}
                            {priceRange === "10to20" && "$10 - $20"}
                            {priceRange === "over20" && "Over $20"}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Count */}
          <div className='flex items-center justify-between'>
            <p className='text-sm font-bold text-gray-500'>
              Showing{" "}
              <motion.span
                key={filteredMeals.length}
                initial={{ scale: 1.2, color: "#FF5722" }}
                animate={{ scale: 1, color: "#FF5722" }}
                transition={{ duration: 0.3 }}
                className='text-brand font-black'>
                {filteredMeals.length}
              </motion.span>{" "}
              {filteredMeals.length === 1 ? "meal" : "meals"}
            </p>
          </div>
        </div>

        {/* --- Content --- */}
        {isLoading ? (
          <div className='py-40'>
            <LoadingSpinner text='Waking up the chefs...' size='lg' />
          </div>
        ) : filteredMeals.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            <AnimatePresence mode='popLayout'>
              {filteredMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  variants={itemVariants}
                  layout
                  initial='hidden'
                  animate='visible'
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}>
                  <MealCard
                    id={meal.id}
                    name={meal.name}
                    price={Number(meal.price)}
                    imageUrl={meal.imageUrl}
                    description={meal.description}
                    category={meal.category?.name || undefined}
                    providerName={meal.provider?.restaurantName || undefined}
                    providerId={meal.provider?.id || ""}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
