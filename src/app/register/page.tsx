"use client";

import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      callbackURL: "/",
    });

    if (error) {
      toast.error(
        error.message || "Failed to create account. Please try again.",
      );
    } else {
      toast.success("Account created successfully! Welcome to FoodHub.");
      router.push("/");
    }
    setIsLoading(false);
  }

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-cream'>
      {/* --- Visual Side (Left) --- */}
      <div className='hidden lg:flex lg:w-1/2 relative bg-charcoal items-center justify-center p-12 overflow-hidden'>
        <div className='absolute inset-0 opacity-80'>
          <Image
            src='/images/register_side.png'
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
            Join the <br />
            <span className='text-brand italic'>Elite Circle.</span>
          </h2>
          <p className='text-cream/80 text-lg font-medium'>
            Create an account to unlock personalized recommendations, exclusive
            gourmet deals, and a seamless dining experience.
          </p>
        </div>
        {/* Abstract Neobrutalist Shape */}
        <div className='absolute -bottom-24 -right-24 size-96 border-[12px] border-brand rotate-12 opacity-50 pointer-events-none'></div>
      </div>

      {/* --- Form Side (Right) --- */}
      <div className='grow flex items-center justify-center p-6 lg:p-24 bg-cream'>
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
              Create Account
            </h1>
            <p className='text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]'>
              Start your culinary journey today
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className='text-xs font-black uppercase tracking-widest text-charcoal'>
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='John Doe'
                          className='h-14 border-[3px] border-charcoal rounded-none text-lg font-bold placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-3 focus-visible:ring-offset-0 placeholder:font-medium placeholder:uppercase placeholder:text-xs'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[10px] font-bold uppercase text-destructive tracking-widest' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className='text-xs font-black uppercase tracking-widest text-charcoal'>
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='name@example.com'
                          className='h-14 border-[3px] border-charcoal rounded-none text-lg font-bold placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-3 focus-visible:ring-offset-0 placeholder:font-medium placeholder:uppercase placeholder:text-xs'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[10px] font-bold uppercase text-destructive tracking-widest' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className='text-xs font-black uppercase tracking-widest text-charcoal'>
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••••'
                          className='h-14 border-[3px] border-charcoal rounded-none text-xl tracking-widest focus-visible:ring-brand focus-visible:ring-3 focus-visible:ring-offset-0'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-[10px] font-bold uppercase text-destructive tracking-widest' />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full h-16 bg-charcoal text-white text-lg font-black rounded-none border-[3px] border-charcoal shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] hover:bg-brand transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed'>
                {isLoading ? "Creating Account..." : "Join FoodHub"}
              </Button>
            </form>
          </Form>

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

            <div className='flex justify-center'>
              <Button
                variant='outline'
                onClick={handleGoogleSignIn}
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
            </div>
          </div>

          <p className='mt-16 text-center text-xs font-bold text-gray-400 uppercase tracking-widest'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='text-brand hover:underline font-black'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
