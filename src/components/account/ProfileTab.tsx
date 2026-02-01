"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Utensils } from "lucide-react";
import Link from "next/link";
import { UserWithExtras, ProviderProfile } from "./types";

interface ProfileTabProps {
  user: UserWithExtras;
  providerProfile: ProviderProfile | null;
  isProviderLoading: boolean;
  onEditProfile: () => void;
}

export function ProfileTab({
  user,
  providerProfile,
  isProviderLoading,
  onEditProfile,
}: ProfileTabProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
        <CardHeader className='flex flex-row items-start justify-between space-y-0'>
          <div>
            <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter text-charcoal'>
              Account Overview
            </CardTitle>
            <CardDescription className='text-[10px] font-black uppercase tracking-[0.2em] text-brand'>
              Verified Profile Details
            </CardDescription>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={onEditProfile}
            className='border-2 border-charcoal rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none'>
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-8'>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <p className='text-[10px] font-black uppercase text-gray-400'>
                Full Name
              </p>
              <p className='font-bold text-charcoal'>{user.name}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-[10px] font-black uppercase text-gray-400'>
                Email Address
              </p>
              <p className='font-bold text-charcoal'>{user.email}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-[10px] font-black uppercase text-gray-400'>
                Primary Address
              </p>
              <p className='font-bold text-charcoal'>
                {user.address || "No address added yet"}
              </p>
            </div>
          </div>

          {user.role !== "provider" && (
            <div className='bg-cream border-2 border-charcoal border-dashed p-6 flex flex-col justify-center items-center text-center gap-4'>
              <div className='size-12 bg-white border-2 border-charcoal flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]'>
                <Store className='size-6 text-brand' />
              </div>
              <div className='space-y-1'>
                <p className='text-[10px] font-black uppercase text-charcoal'>
                  Partner with us
                </p>
                <p className='text-xs font-medium text-gray-500'>
                  Own a kitchen? Start selling on FoodHub today.
                </p>
              </div>
              <Button
                asChild
                className='w-full bg-charcoal text-white font-black uppercase tracking-widest text-[8px] h-10 rounded-none border-2 border-charcoal hover:bg-brand transition-all'>
                <Link href='/become-provider'>Become a Provider</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {user.role === "provider" && (
        <Card className='rounded-none border-4 border-charcoal bg-charcoal text-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
          <CardHeader>
            <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
              Kitchen Statistics
            </CardTitle>
            <CardDescription className='text-brand text-[10px] font-black uppercase tracking-[0.2em]'>
              Live Menu Status
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-8'>
            <div className='flex items-center gap-6'>
              <div className='size-16 bg-white border-4 border-brand flex items-center justify-center rotate-3'>
                <Utensils className='size-8 text-charcoal' />
              </div>
              <div>
                <p className='text-[10px] font-black uppercase tracking-widest text-white/50'>
                  Active Meals
                </p>
                <p className='text-4xl font-serif font-black leading-none'>
                  {isProviderLoading
                    ? "..."
                    : providerProfile?.meals.length || 0}
                </p>
              </div>
            </div>
            <Button
              asChild
              className='w-full bg-brand text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-white hover:bg-white hover:text-brand transition-all'>
              <Link href='/restaurant-dashboard'>Open Management Console</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
