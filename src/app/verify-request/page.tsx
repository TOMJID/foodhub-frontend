import { Suspense } from "react";
import { Metadata } from "next";
import { VerifyRequestContent } from "@/components/auth/VerifyRequestContent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Verify Request",
  description: "Check your email for the verification link.",
};

export default function VerifyRequestPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-cream flex items-center justify-center'>
          <LoadingSpinner text='Loading...' size='lg' />
        </div>
      }>
      <VerifyRequestContent />
    </Suspense>
  );
}
