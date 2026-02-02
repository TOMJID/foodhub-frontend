"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Store,
  MapPin,
  Utensils,
  Globe,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface UserWithExtras {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string;
}

const providerSchema = z.object({
  restaurantName: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters."),
  cuisineType: z.string().min(2, "Cuisine type must be at least 2 characters."),
  address: z.string().min(5, "Please provide a complete address."),
  coverImageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

export function BecomeProviderContent() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      restaurantName: "",
      cuisineType: "",
      address: "",
      coverImageUrl: "",
    },
  });

  if (isAuthPending) {
    return (
      <div className='min-h-screen bg-cream flex items-center justify-center'>
        <Loader2 className='size-12 text-brand animate-spin' />
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/become-provider");
    return null;
  }

  // If already a provider, show a message or redirect
  if ((session.user as UserWithExtras).role === "provider") {
    return (
      <div className='min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center'>
        <div className='size-24 bg-white border-4 border-charcoal flex items-center justify-center rotate-6 shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] mb-8'>
          <Store className='size-12 text-brand' />
        </div>
        <h1 className='text-4xl font-serif font-black text-charcoal uppercase tracking-tighter mb-4'>
          You&apos;re already a Partner!
        </h1>
        <p className='max-w-md text-gray-500 font-bold uppercase tracking-widest text-xs mb-8'>
          Your kitchen is already active on FoodHub. Manage your menu and orders
          from your dashboard.
        </p>
        <Button
          asChild
          className='bg-charcoal text-white font-black uppercase tracking-widest rounded-none border-2 border-charcoal px-8 py-6 shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] hover:bg-brand transition-all'>
          <Link href='/account'>Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(values: ProviderFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Welcome to the family! Your profile is ready.");
        router.push("/account?tab=profile");
        // Force refresh session to update role
        router.refresh();
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to create provider profile. Connection error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='min-h-screen bg-cream selection:bg-brand selection:text-white'>
      {/* --- Simple Navigation --- */}
      <header className='bg-white border-b-4 border-charcoal sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <Link href='/' className='group flex items-center gap-2'>
            <div className='size-10 border-2 border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all'>
              <ChevronLeft className='size-5' />
            </div>
            <span className='text-xl font-serif font-black tracking-tighter text-charcoal uppercase italic'>
              Back to Home
            </span>
          </Link>
          <span className='text-xs font-black uppercase tracking-[0.3em] text-gray-300 hidden md:block'>
            Merchant Onboarding
          </span>
        </div>
      </header>

      <main className='max-w-4xl mx-auto px-6 py-16 md:py-24'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-12 items-start'>
          {/* --- Left Column: Context --- */}
          <div className='md:col-span-5 space-y-8'>
            <div className='space-y-4'>
              <span className='text-brand font-black uppercase tracking-[0.2em] text-[10px] bg-brand/10 px-3 py-1 border-brand/20 border'>
                Become a Partner
              </span>
              <h1 className='text-5xl md:text-7xl font-serif font-black text-charcoal leading-[0.9] tracking-tighter italic'>
                Grow Your <br />
                <span className='text-brand not-italic'>Kitchen.</span>
              </h1>
            </div>

            <p className='text-lg font-medium text-gray-600 leading-relaxed'>
              Join the city&apos;s premier network of chefs and restaurants. We
              handle the logistics, you handle the flavor.
            </p>

            <div className='space-y-6 pt-4'>
              {[
                {
                  icon: Globe,
                  title: "Global Reach",
                  desc: "Access thousands of hungry customers instantly.",
                },
                {
                  icon: Utensils,
                  title: "Menu Control",
                  desc: "Easily update items, prices, and availability.",
                },
                {
                  icon: Store,
                  title: "Total Ownership",
                  desc: "Manage your brand exactly how you want it.",
                },
              ].map((item, i) => (
                <div key={i} className='flex gap-4'>
                  <div className='size-10 bg-white border-2 border-charcoal shrink-0 flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]'>
                    <item.icon className='size-5 text-charcoal' />
                  </div>
                  <div>
                    <h4 className='font-serif font-black text-charcoal uppercase leading-none mb-1'>
                      {item.title}
                    </h4>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Right Column: Form --- */}
          <div className='md:col-span-7'>
            <Card className='rounded-none border-4 border-charcoal bg-white shadow-[12px_12px_0px_0px_rgba(10,10,10,1)]'>
              <CardHeader className='space-y-1 bg-charcoal text-white p-8'>
                <CardTitle className='font-serif font-black text-3xl uppercase tracking-tighter'>
                  Register Kitchen
                </CardTitle>
                <CardDescription className='text-[10px] font-black uppercase tracking-[0.3em] text-brand'>
                  Basic Information
                </CardDescription>
              </CardHeader>
              <CardContent className='p-8'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='restaurantName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='font-black uppercase tracking-widest text-[10px] text-charcoal'>
                            Restaurant Name
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Store className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
                              <Input
                                placeholder='E.G. THE RUSTIC BISTRO'
                                {...field}
                                className='h-14 pl-12 rounded-none border-2 border-charcoal focus-visible:ring-brand font-bold placeholder:text-gray-300 uppercase'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='cuisineType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='font-black uppercase tracking-widest text-[10px] text-charcoal'>
                            Cuisine Type
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Utensils className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
                              <Input
                                placeholder='E.G. FRENCH FUSION, ITALIAN...'
                                {...field}
                                className='h-14 pl-12 rounded-none border-2 border-charcoal focus-visible:ring-brand font-bold placeholder:text-gray-300 uppercase'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='font-black uppercase tracking-widest text-[10px] text-charcoal'>
                            Business Address
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
                              <Input
                                placeholder='E.G. 123 CULINARY ST, FOOD CITY'
                                {...field}
                                className='h-14 pl-12 rounded-none border-2 border-charcoal focus-visible:ring-brand font-bold placeholder:text-gray-300 uppercase'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='coverImageUrl'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='font-black uppercase tracking-widest text-[10px] text-charcoal'>
                            Cover Image URL (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='HTTPS://EXAMPLE.COM/IMAGE.JPG'
                              {...field}
                              className='h-14 rounded-none border-2 border-charcoal focus-visible:ring-brand font-bold placeholder:text-gray-300'
                            />
                          </FormControl>
                          <FormMessage />
                          <p className='text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2'>
                            Leave blank to use a custom illustrated fallback.
                          </p>
                        </FormItem>
                      )}
                    />

                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full h-16 bg-brand text-white font-black uppercase tracking-widest rounded-none border-2 border-charcoal hover:bg-black transition-all shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'>
                      {isSubmitting ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Onboarding...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <ArrowRight className='ml-2 h-4 w-4' />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
