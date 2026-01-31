"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Loader2,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tags,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login?redirect=/admin");
      } else if (
        (session.user as unknown as { role: string }).role !== "admin"
      ) {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  if (
    isPending ||
    !session ||
    (session.user as unknown as { role: string }).role !== "admin"
  ) {
    return (
      <div className='min-h-screen bg-cream flex flex-col items-center justify-center gap-6'>
        <Loader2 className='size-20 text-brand animate-spin' />
        <p className='text-xl font-black uppercase tracking-widest text-charcoal/30 italic'>
          Authenticating Admin Access...
        </p>
      </div>
    );
  }

  const navItems = [
    { name: "Stats Overview", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Global Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Menu Categories", href: "/admin/categories", icon: Tags },
  ];

  return (
    <div className='min-h-screen bg-cream flex'>
      {/* --- Sidebar --- */}
      <aside className='w-80 bg-white border-r-4 border-charcoal fixed h-full z-50 overflow-y-auto hidden lg:block'>
        <div className='p-8 space-y-12'>
          <Link href='/' className='block group text-center'>
            <div className='inline-flex items-center justify-center size-16 bg-brand border-4 border-charcoal mb-4 rotate-3 group-hover:rotate-0 transition-transform shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
              <ShieldCheck className='size-10 text-white' />
            </div>
            <h1 className='text-3xl font-serif font-black tracking-tighter text-charcoal leading-none'>
              ADMIN<span className='text-brand block'>CONTROL</span>
            </h1>
          </Link>

          <nav className='space-y-4'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between p-4 border-4 transition-all group ${
                    isActive
                      ? "bg-charcoal border-charcoal text-white shadow-[6px_6px_0px_0px_rgba(255,87,34,1)]"
                      : "bg-white border-charcoal text-charcoal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]"
                  }`}>
                  <div className='flex items-center gap-4'>
                    <Icon
                      className={`size-5 ${isActive ? "text-brand" : "text-charcoal group-hover:text-brand"}`}
                    />
                    <span className='text-[10px] font-black uppercase tracking-widest'>
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight
                    className={`size-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className='pt-12'>
            <Button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: { onSuccess: () => router.push("/") },
                })
              }
              className='w-full h-14 bg-white text-charcoal border-4 border-charcoal rounded-none font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white hover:border-black transition-all shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:shadow-none'>
              <LogOut className='size-4 mr-3' />
              Exit Portal
            </Button>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className='flex-1 lg:ml-80'>
        <header className='h-20 bg-white border-b-4 border-charcoal flex items-center justify-between px-8 sticky top-0 z-40 lg:hidden'>
          <Link
            href='/'
            className='text-2xl font-serif font-black italic tracking-tighter'>
            ADMIN<span className='text-brand'>.HUB</span>
          </Link>
          <div className='flex items-center gap-4 italic font-black text-[10px] uppercase'>
            {navItems.find((i) => i.href === pathname)?.name}
          </div>
        </header>

        <div className='p-8 lg:p-12 max-w-7xl mx-auto'>{children}</div>
      </main>
    </div>
  );
}
