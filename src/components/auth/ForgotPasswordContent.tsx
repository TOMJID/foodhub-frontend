"use client";

import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";
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
import { authClient } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export function ForgotPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // @ts-expect-error - forgetPassword might not be in the types but is supported by the backend
    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(
        error.message || "Failed to send reset link. Please try again.",
      );
    } else {
      toast.success("Reset link sent! Please check your email.");
      setIsSent(true);
    }
    setIsLoading(false);
  }

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
        <div className='absolute inset-0 bg-black/70'></div>
        <div className='relative z-10 max-w-lg text-center'>
          <Link href='/' className='inline-block mb-12'>
            <span className='text-4xl font-serif font-black tracking-tighter text-white'>
              FOOD<span className='text-brand'>HUB</span>
            </span>
          </Link>
          <h2 className='text-5xl font-serif font-black text-white leading-tight tracking-tighter mb-6'>
            Recover your <br />
            <span className='text-brand italic'>Access to Flavor.</span>
          </h2>
          <p className='text-cream/80 text-lg font-medium'>
            Don&apos;t worry, even the best chefs lose their way sometimes.
            We&apos;ll help you get back to your culinary journey.
          </p>
        </div>
        <div className='absolute -bottom-24 -right-24 size-96 border-12 border-brand rotate-12 opacity-50 pointer-events-none'></div>
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
              Forgot Password
            </h1>
            <p className='text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]'>
              Enter your email to receive a reset link
            </p>
          </div>

          {!isSent ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'>
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

                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-16 bg-charcoal text-white text-lg font-black rounded-none border-[3px] border-charcoal shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] hover:bg-brand transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed'>
                  {isLoading ? (
                    <LoadingSpinner
                      size='sm'
                      text=''
                      brutalist={false}
                      className='p-0'
                    />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className='p-8 border-[3px] border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] space-y-6'>
              <div className='w-16 h-16 bg-green-100 flex items-center justify-center border-[3px] border-charcoal'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={3}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <div className='space-y-2'>
                <h3 className='text-xl font-serif font-black text-charcoal'>
                  Check your inbox!
                </h3>
                <p className='text-sm font-bold text-gray-500'>
                  We&apos;ve sent a password reset link to{" "}
                  <span className='text-charcoal'>
                    {form.getValues("email")}
                  </span>
                  .
                </p>
              </div>
              <Button
                variant='outline'
                asChild
                className='w-full h-12 border-[3px] border-charcoal rounded-none text-xs font-black uppercase hover:bg-charcoal hover:text-white transition-all'>
                <Link href='/login'>Back to Login</Link>
              </Button>
            </div>
          )}

          <p className='mt-16 text-center text-xs font-bold text-gray-400 uppercase tracking-widest'>
            Remembered your password?{" "}
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
