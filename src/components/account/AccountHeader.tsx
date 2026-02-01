"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AccountHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-charcoal'>
      <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
        <Link href='/' className='group'>
          <span className='text-3xl font-serif font-black tracking-tighter text-charcoal group-hover:text-brand transition-colors'>
            FOOD
            <span className='text-brand group-hover:text-charcoal transition-colors'>
              HUB
            </span>
          </span>
        </Link>

        <Button
          variant='ghost'
          onClick={handleLogout}
          className='flex items-center gap-2 font-black uppercase tracking-widest text-charcoal hover:bg-brand hover:text-white transition-all border-2 border-transparent hover:border-charcoal rounded-none'>
          <LogOut className='size-4' />
          Logout
        </Button>
      </div>
    </header>
  );
}
