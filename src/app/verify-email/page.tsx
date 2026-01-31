"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [error, setError] = useState<string | null>(
    token ? null : "No verification token found.",
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      const { error } = await authClient.verifyEmail({
        query: { token },
      });

      if (error) {
        setStatus("error");
        setError(error.message || "Failed to verify email.");
        toast.error(error.message || "Verification failed.");
      } else {
        setStatus("success");
        toast.success("Email verified successfully!");
        // Optional: auto-redirect after delay
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      }
    };

    verify();
  }, [token, router]);

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

        {/* Status Card */}
        <div className='bg-white border-[3px] border-charcoal p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] flex flex-col items-center text-center space-y-8'>
          {status === "loading" && (
            <>
              <div className='size-20 bg-brand/10 border-[3px] border-charcoal flex items-center justify-center'>
                <Loader2
                  className='size-10 text-brand animate-spin'
                  strokeWidth={3}
                />
              </div>
              <div className='space-y-4'>
                <h1 className='text-4xl font-serif font-black text-charcoal tracking-tighter'>
                  Verifying...
                </h1>
                <p className='text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]'>
                  Just a moment while we confirm your email
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className='size-20 bg-green-500/10 border-[3px] border-charcoal flex items-center justify-center font-bold'>
                <CheckCircle2
                  className='size-10 text-green-600'
                  strokeWidth={3}
                />
              </div>
              <div className='space-y-4'>
                <h1 className='text-4xl font-serif font-black text-charcoal tracking-tighter'>
                  Verified!
                </h1>
                <p className='text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]'>
                  Your account is now fully active
                </p>
              </div>
              <p className='text-gray-600 font-medium'>
                Thank you for verifying your email. You can now access all
                features of FoodHub.
              </p>
              <Button
                asChild
                className='w-full h-14 bg-charcoal text-white text-sm font-black uppercase rounded-none border-[3px] border-charcoal shadow-[6px_6px_0px_0px_rgba(255,87,34,1)] hover:bg-brand transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] active:translate-x-0 active:translate-y-0 active:shadow-none'>
                <Link href='/login'>
                  Sign In to Continue <ArrowRight className='ml-2 size-4' />
                </Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className='size-20 bg-destructive/10 border-[3px] border-charcoal flex items-center justify-center'>
                <XCircle className='size-10 text-destructive' strokeWidth={3} />
              </div>
              <div className='space-y-4'>
                <h1 className='text-4xl font-serif font-black text-charcoal tracking-tighter'>
                  Verification Failed
                </h1>
                <p className='text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]'>
                  Something went wrong
                </p>
              </div>
              <p className='text-destructive font-bold text-sm bg-destructive/5 p-4 border-2 border-destructive/20'>
                {error || "The link may be expired or invalid."}
              </p>
              <div className='w-full space-y-4'>
                <Button
                  asChild
                  className='w-full h-14 bg-brand text-white text-sm font-black uppercase rounded-none border-[3px] border-charcoal shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:bg-brand-dark transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(10,10,10,1)] active:translate-x-0 active:translate-y-0 active:shadow-none'>
                  <Link href='/register'>Try Registering Again</Link>
                </Button>
                <Button
                  variant='outline'
                  asChild
                  className='w-full h-14 border-[3px] border-charcoal rounded-none text-xs font-black uppercase hover:bg-charcoal hover:text-white transition-all'>
                  <Link href='/'>Back to Home</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
