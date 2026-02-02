import { Suspense } from "react";
import { Metadata } from "next";
import { AccountContent } from "@/components/account/AccountContent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your profile, orders, and restaurant information.",
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-cream'>
          <LoadingSpinner
            text='Loading Account...'
            size='xl'
            className='h-screen'
          />
        </div>
      }>
      <AccountContent />
    </Suspense>
  );
}
