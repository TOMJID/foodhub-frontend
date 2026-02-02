import { Suspense } from "react";
import { Metadata } from "next";
import { ResetPasswordContent } from "@/components/auth/ResetPasswordContent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Secure your FoodHub account with a new password.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-cream flex items-center justify-center'>
          <LoadingSpinner text='Verifying...' size='lg' />
        </div>
      }>
      <ResetPasswordContent />
    </Suspense>
  );
}
