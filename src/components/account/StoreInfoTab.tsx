"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Star, ChefHat, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProviderProfile } from "./types";

interface StoreInfoTabProps {
  providerProfile: ProviderProfile | null;
  isProviderLoading: boolean;
  onEditStore: () => void;
}

export function StoreInfoTab({
  providerProfile,
  isProviderLoading,
  onEditStore,
}: StoreInfoTabProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* Store Overview */}
      <Card className='lg:col-span-2 rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
        <CardHeader className='border-b-4 border-charcoal bg-charcoal text-white'>
          <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
            Restaurant Details
          </CardTitle>
          <CardDescription className='text-brand text-[10px] font-black uppercase tracking-[0.2em]'>
            Your public business profile
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-8 space-y-8'>
          {isProviderLoading ? (
            <div className='py-12 flex justify-center'>
              <LoadingSpinner size='lg' text='Loading Store...' />
            </div>
          ) : providerProfile ? (
            <>
              <div className='relative h-48 border-4 border-charcoal overflow-hidden group bg-cream'>
                {providerProfile.coverImageUrl ? (
                  <Image
                    src={providerProfile.coverImageUrl}
                    alt={providerProfile.restaurantName}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='size-full flex flex-col items-center justify-center opacity-20'>
                    <Store className='size-12' />
                    <p className='font-black uppercase text-[10px] mt-2'>
                      No Cover Image
                    </p>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                  <div className='space-y-1'>
                    <p className='text-[10px] font-black uppercase text-gray-400'>
                      Restaurant Name
                    </p>
                    <p className='text-2xl font-serif font-black text-charcoal'>
                      {providerProfile.restaurantName}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[10px] font-black uppercase text-gray-400'>
                      Cuisine Specialty
                    </p>
                    <Badge className='bg-brand text-white border-charcoal border-2 rounded-none uppercase text-[10px] font-black px-4 py-1'>
                      {providerProfile.cuisineType}
                    </Badge>
                  </div>
                </div>
                <div className='space-y-6'>
                  <div className='space-y-1'>
                    <p className='text-[10px] font-black uppercase text-gray-400'>
                      Location Address
                    </p>
                    <p className='font-bold text-charcoal'>
                      {providerProfile.address}
                    </p>
                  </div>
                  <div className='p-4 bg-cream border-2 border-charcoal border-dashed'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Star className='size-3 text-brand fill-brand' />
                      <p className='text-[10px] font-black uppercase text-charcoal'>
                        Store Health
                      </p>
                    </div>
                    <p className='text-[8px] font-bold text-gray-500 uppercase'>
                      Your store is live and visible to all customers.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='py-12 text-center space-y-4'>
              <AlertCircle className='size-12 text-brand mx-auto' />
              <p className='font-black uppercase text-charcoal'>
                No profile found
              </p>
              <Button
                asChild
                className='rounded-none bg-charcoal text-white font-black uppercase tracking-widest text-[10px]'>
                <Link href='/become-provider'>Create Profile</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Store Side Stats */}
      <div className='space-y-8'>
        <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
          <CardHeader className='pb-2'>
            <CardTitle className='font-black uppercase text-xs tracking-widest text-charcoal'>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Button
              asChild
              className='w-full bg-brand text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none transition-all'>
              <Link href='/restaurant-dashboard'>
                <ChefHat className='size-4 mr-2' />
                Kitchen Console
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={onEditStore}
              className='w-full border-2 border-charcoal font-black uppercase tracking-widest text-[10px] h-12 rounded-none hover:bg-charcoal hover:text-white transition-all'>
              Edit Store Info
            </Button>
          </CardContent>
        </Card>

        <Card className='rounded-none border-4 border-charcoal bg-charcoal text-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
          <CardHeader>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-brand'>
              Menu Stats
            </p>
            <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between border-b border-white/10 pb-4 mb-4'>
              <span className='text-[10px] font-black uppercase text-white/50'>
                Total Meals
              </span>
              <span className='text-3xl font-serif font-black text-brand'>
                {providerProfile?.meals.length || 0}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-[10px] font-black uppercase text-white/50'>
                Available
              </span>
              <span className='text-xl font-bold'>
                {providerProfile?.meals.filter((m) => m.isAvailable).length ||
                  0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
