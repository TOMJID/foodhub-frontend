"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function VerifyRequestContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className='min-h-screen bg-cream flex items-center justify-center p-6'>
      <div className='max-w-md w-full'>
        {/* Logo */}
        <div className='text-center mb-12'>
          <Link href='/'>
            <span className='text-3xl font-serif font-black tracking-tighter text-charcoal'>
              FOOD<span className='text-brand'>HUB</span>
            </span>
          </Link>
        </div>

        {/* Content Card */}
        <div className='bg-white border-[3px] border-charcoal p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] flex flex-col items-center text-center space-y-8'>
          <div className='size-20 bg-brand/10 border-[3px] border-charcoal flex items-center justify-center'>
            <Mail className='size-10 text-brand' strokeWidth={3} />
          </div>

          <div className='space-y-4'>
            <h1 className='text-4xl font-serif font-black text-charcoal tracking-tighter'>
              Check Your Email
            </h1>
            <p className='text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]'>
              Verification link sent to
            </p>
            <p className='text-charcoal font-black text-lg break-all'>
              {email || "your inbox"}
            </p>
          </div>

          <p className='text-gray-600 font-medium leading-relaxed'>
            We&apos;ve sent a verification link to your email address. Please
            click the link to activate your account and start your culinary
            journey.
          </p>

          <div className='w-full pt-4 space-y-4'>
            <Button
              asChild
              className='w-full h-14 bg-brand text-white text-sm font-black uppercase rounded-none border-[3px] border-charcoal shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:bg-brand-dark transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(10,10,10,1)] active:translate-x-0 active:translate-y-0 active:shadow-none'>
              <a href={`mailto:${email}`}>
                Open Email App <ArrowRight className='ml-2 size-4' />
              </a>
            </Button>

            <Button
              variant='outline'
              asChild
              className='w-full h-14 border-[3px] border-charcoal rounded-none text-xs font-black uppercase hover:bg-charcoal hover:text-white transition-all'>
              <Link href='/login'>
                <ArrowLeft className='mr-2 size-4' /> Back to Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className='mt-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-4'>
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <button className='text-brand hover:underline font-black'>
            click here to resend
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={null}>
      <VerifyRequestContent />
    </Suspense>
  );
}
