"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { User, Clock, Star, MapPin, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className='flex flex-col min-h-screen'>
      {/* --- Navbar --- */}
      <header className='fixed top-0 left-0 right-0 z-50 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md border-[3px] border-charcoal px-6 py-3 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='text-2xl font-serif font-black tracking-tighter text-charcoal'>
              FOOD<span className='text-brand'>HUB</span>
            </span>
          </Link>

          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList className='gap-2'>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}>
                  <Link href='/meals'>Browse Meals</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}>
                  <Link href='/restaurants'>Restaurants</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {session?.user &&
                (session.user as unknown as { role: string }).role ===
                  "admin" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}>
                      <Link href='/admin' className='text-brand font-black'>
                        Admin Panel
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className='flex items-center gap-4'>
            {isPending ? (
              <div className='hidden md:flex items-center gap-2 bg-charcoal/5 px-2 py-1 border-[3px] border-charcoal/10 scale-90 translate-y-[-2px]'>
                <LoadingSpinner
                  size='sm'
                  text=''
                  brutalist={false}
                  className='p-0'
                />
              </div>
            ) : session ? (
              <Link
                href='/account'
                className='hidden md:flex items-center gap-2 bg-charcoal text-white px-4 py-2 text-xs font-black uppercase tracking-widest border-[3px] border-charcoal hover:bg-brand transition-colors shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]'>
                <User className='size-4' />
                Account
              </Link>
            ) : (
              <Link
                href='/login'
                className='hidden md:block text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors'>
                Login
              </Link>
            )}
            <CartSheet />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='md:hidden'>
                  <Menu className='size-6' />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='bg-cream border-l-4 border-charcoal p-0'>
                <SheetHeader className='p-6 border-b-2 border-charcoal'>
                  <SheetTitle className='text-2xl font-serif font-black tracking-tighter text-charcoal'>
                    FOOD<span className='text-brand'>HUB</span>
                  </SheetTitle>
                </SheetHeader>
                <div className='flex flex-col p-6 gap-6'>
                  <Link
                    href='/meals'
                    className='text-2xl font-black uppercase hover:text-brand transition-colors'>
                    Browse Meals
                  </Link>
                  <Link
                    href='/restaurants'
                    className='text-2xl font-black uppercase hover:text-brand transition-colors'>
                    Restaurants
                  </Link>
                  {session?.user &&
                    (session.user as unknown as { role: string }).role ===
                      "admin" && (
                      <Link
                        href='/admin'
                        className='text-2xl font-black uppercase text-brand transition-colors'>
                        Admin Panel
                      </Link>
                    )}
                  <Separator className='bg-charcoal/10' />
                  {isPending ? (
                    <div className='flex items-center gap-2 text-xl font-black uppercase text-charcoal/20'>
                      <LoadingSpinner
                        size='sm'
                        text=''
                        brutalist={false}
                        className='p-0'
                      />
                      Loading...
                    </div>
                  ) : session ? (
                    <Link
                      href='/account'
                      className='text-xl font-black uppercase text-brand flex items-center gap-2'>
                      <User className='size-5' />
                      Account
                    </Link>
                  ) : (
                    <Link
                      href='/login'
                      className='text-xl font-black uppercase text-brand'>
                      Login
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className='grow pt-32'>
        {/* --- Hero Section --- */}
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
                transcend the ordinary. Every order is a curated journey of
                flavor and craft.
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

        {/* --- Categories Section --- */}
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
              {[
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
              ].map((category, idx) => (
                <Card
                  key={idx}
                  className='bg-transparent border-[3px] border-cream/20 rounded-none overflow-hidden group hover:border-brand transition-colors duration-500'>
                  <CardContent className='p-0 relative aspect-square'>
                    <Image
                      src={category.img}
                      alt={category.name}
                      fill
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

        {/* --- Featured Section --- */}
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
              {[
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
              ].map((provider, idx) => (
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

        {/* --- Footer / CTA --- */}
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
                      <a
                        href='#'
                        className='hover:text-brand transition-colors'>
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-brand transition-colors'>
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-brand transition-colors'>
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='hover:text-brand transition-colors'>
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
                <Link
                  href='/terms'
                  className='hover:text-white transition-colors'>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
