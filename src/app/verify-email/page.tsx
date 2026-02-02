import { Suspense } from "react";
import { Metadata } from "next";
import { VerifyEmailContent } from "@/components/auth/VerifyEmailContent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your FoodHub account.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-cream flex items-center justify-center'>
          <LoadingSpinner text='Preparing verification...' size='lg' />
        </div>
      }>
      <VerifyEmailContent />
    </Suspense>
  );
}
