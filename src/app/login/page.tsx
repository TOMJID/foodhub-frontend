"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-cream'>
      {/* --- Visual Side (Left) --- */}
      <div className='hidden lg:flex lg:w-1/2 relative bg-charcoal items-center justify-center p-12 overflow-hidden'>
        <div className='absolute inset-0 opacity-80'>
          <Image
            src='/images/login_side.png'
            alt='Artistic food photography'
            fill
            className='object-cover'
            priority
          />
        </div>
        <div className='relative z-10 max-w-lg text-center'>
          <Link href='/' className='inline-block mb-12'>
            <span className='text-4xl font-serif font-black tracking-tighter text-white'>
              FOOD<span className='text-brand'>HUB</span>
            </span>
          </Link>
          <h2 className='text-5xl font-serif font-black text-white leading-tight tracking-tighter mb-6'>
            Welcome back to the <br />
            <span className='text-brand italic'>Sanctuary of Taste.</span>
          </h2>
          <p className='text-cream/80 text-lg font-medium'>
            Login to access your curated selection of meals, track order
            progress, and explore new culinary horizons.
          </p>
        </div>
        {/* Abstract Neobrutalist Shape */}
        <div className='absolute -bottom-24 -right-24 size-96 border-[12px] border-brand rotate-12 opacity-50 pointer-events-none'></div>
      </div>

      {/* --- Form Side (Right) --- */}
      <div className='flex-grow flex items-center justify-center p-6 lg:p-24 bg-cream'>
        <div className='w-full max-w-md'>
          <div className='lg:hidden text-center mb-12'>
            <Link href='/'>
              <span className='text-3xl font-serif font-black tracking-tighter text-charcoal'>
                FOOD<span className='text-brand'>HUB</span>
              </span>
            </Link>
          </div>

          <div className='space-y-2 mb-10'>
            <h1 className='text-4xl font-serif font-black text-charcoal tracking-tighter'>
              Sign In
            </h1>
            <p className='text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]'>
              Enter your credentials to continue
            </p>
          </div>

          <form className='space-y-8' onSubmit={(e) => e.preventDefault()}>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-xs font-black uppercase tracking-widest text-charcoal'>
                  Email Address
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  className='h-14 border-[3px] border-charcoal rounded-none text-lg font-bold placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-3 focus-visible:ring-offset-0 placeholder:font-medium placeholder:uppercase placeholder:text-xs'
                />
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <Label
                    htmlFor='password'
                    className='text-xs font-black uppercase tracking-widest text-charcoal'>
                    Password
                  </Label>
                  <Link
                    href='#'
                    className='text-[10px] font-black uppercase text-brand hover:underline'>
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='h-14 border-[3px] border-charcoal rounded-none text-xl tracking-widest focus-visible:ring-brand focus-visible:ring-3 focus-visible:ring-offset-0'
                />
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='remember'
                className='border-2 border-charcoal rounded-none data-[state=checked]:bg-brand data-[state=checked]:border-brand'
              />
              <Label
                htmlFor='remember'
                className='text-xs font-bold text-charcoal leading-none cursor-pointer'>
                Remember my session for 30 days
              </Label>
            </div>

            <Button className='w-full h-16 bg-charcoal text-white text-lg font-black rounded-none border-[3px] border-charcoal shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] hover:bg-brand transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] active:translate-x-0 active:translate-y-0 active:shadow-none'>
              Sign In to Your Account
            </Button>
          </form>

          <div className='mt-12 space-y-8'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='bg-charcoal/10 h-[2px]' />
              </div>
              <div className='relative flex justify-center text-[10px] uppercase font-black tracking-widest'>
                <span className='bg-cream px-4 text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Button
                variant='outline'
                className='h-14 border-[3px] border-charcoal rounded-none text-xs font-black uppercase hover:bg-charcoal hover:text-white transition-all'>
                <svg
                  className='mr-2 h-4 w-4'
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fab'
                  data-icon='google'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 488 512'>
                  <path
                    fill='currentColor'
                    d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
                </svg>
                Google
              </Button>
              <Button
                variant='outline'
                className='h-14 border-[3px] border-charcoal rounded-none text-xs font-black uppercase hover:bg-charcoal hover:text-white transition-all'>
                <svg
                  className='mr-2 h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                </svg>
                Github
              </Button>
            </div>
          </div>

          <p className='mt-16 text-center text-xs font-bold text-gray-400 uppercase tracking-[0.1em]'>
            New to FoodHub?{" "}
            <Link
              href='/register'
              className='text-brand hover:underline font-black'>
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
