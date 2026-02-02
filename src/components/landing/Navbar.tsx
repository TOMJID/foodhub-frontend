"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CartSheet } from "@/components/cart-sheet";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className='fixed top-0 left-0 right-0 z-50 px-6 py-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md border-[3px] border-charcoal px-6 py-3 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
        <Link
          href='/'
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className='flex items-center gap-4 group'>
          <div className='relative border-[3px] border-charcoal p-1.5 transition-all duration-300 group-hover:rotate-6 group-hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
            <Image
              src='/logo.png'
              alt='FoodHub'
              width={32}
              height={32}
              className='object-contain invert-0 transition-transform'
              style={{ height: "auto" }}
              priority
            />
          </div>
          <span className='text-2xl font-serif font-black tracking-tighter text-charcoal'>
            F00D<span className='text-brand'>HUB</span>
          </span>
        </Link>

        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList className='gap-2'>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}>
                <Link href='/meals'>Meals</Link>
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
            <div className='hidden md:flex items-center gap-2 bg-charcoal/5 px-2 py-1 border-[3px] border-charcoal/10 scale-90 -translate-y-0.5'>
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
                <SheetTitle className='flex items-center gap-4 text-2xl font-serif font-black tracking-tighter text-charcoal text-left'>
                  <div className='bg-brand border-[3px] border-charcoal p-1 shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]'>
                    <Image
                      src='/logo.png'
                      alt='FoodHub'
                      width={28}
                      height={28}
                      className='object-contain'
                    />
                  </div>
                  <span>
                    FOOD<span className='text-brand'>HUB</span>
                  </span>
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
  );
}
