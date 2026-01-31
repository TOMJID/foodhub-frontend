"use client";

import { useCart } from "@/store/useCart";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Truck,
  Loader2,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const { items, totalPrice, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/login?redirect=/checkout");
    }
    if (session?.user && "address" in session.user && session.user.address) {
      setAddress(session.user.address as string);
    }
  }, [session, isAuthLoading, router]);

  useEffect(() => {
    if (!isAuthLoading && items.length === 0 && !isSuccess) {
      router.push("/meals");
    }
  }, [items, isAuthLoading, isSuccess, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Confirming your feast...");

    try {
      // Per our API, we only support one restaurant per order
      const providerId = items[0].restaurantId;
      const orderItems = items.map((i) => ({
        mealId: i.id,
        quantity: i.quantity,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          items: orderItems,
          deliveryAddress: address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.dismiss(loadingToast);
        setIsSuccess(true);
        clearCart();
        toast.success("Order Placed! The kitchen is fired up.");
        // Redirect to order details instead of account
        setTimeout(() => {
          router.push(`/orders/${data.data.id}`);
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to place order");
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className='min-h-screen bg-cream flex items-center justify-center'>
        <Loader2 className='size-12 text-brand animate-spin' />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center space-y-8'>
        <div className='size-32 bg-white border-8 border-brand flex items-center justify-center rotate-6 shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
          <CheckCircle2 className='size-16 text-brand' />
        </div>
        <div className='space-y-4'>
          <h1 className='text-6xl font-serif font-black text-charcoal tracking-tighter uppercase italic'>
            Order <span className='text-brand not-italic'>Confirmed!</span>
          </h1>
          <p className='text-sm font-black uppercase tracking-[0.2em] text-charcoal/40'>
            Redirecting you to the live tracker...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-cream selection:bg-brand selection:text-white pb-20'>
      {/* --- Simple Nav --- */}
      <header className='bg-white border-b-4 border-charcoal sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <Link href='/meals' className='group flex items-center gap-2'>
            <div className='size-10 border-2 border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all'>
              <ChevronLeft className='size-5' />
            </div>
            <span className='text-xs font-black uppercase tracking-widest'>
              Back to Menu
            </span>
          </Link>
          <span className='font-serif font-black text-2xl tracking-tighter uppercase italic'>
            Final <span className='text-brand not-italic'>Step.</span>
          </span>
          <div className='size-10' /> {/* Spacer */}
        </div>
      </header>

      <main className='max-w-5xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          {/* --- Left Column: Forms --- */}
          <div className='lg:col-span-7 space-y-8'>
            <section className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-brand text-white size-8 border-2 border-charcoal flex items-center justify-center font-black rotate-[-10deg] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
                  1
                </div>
                <h2 className='text-2xl font-serif font-black text-charcoal uppercase tracking-tight'>
                  Delivery Destination
                </h2>
              </div>

              <div className='bg-white border-4 border-charcoal p-8 shadow-[12px_12px_0px_0px_rgba(255,87,34,1)]'>
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-black uppercase tracking-widest text-charcoal/40 flex items-center gap-2'>
                      <MapPin className='size-3 text-brand' /> Complete Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder='STREET, BUILDING, APARTMENT, LANDMARK...'
                      className='w-full min-h-[120px] bg-cream border-4 border-charcoal p-4 font-black uppercase text-xs placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-brand/20 resize-none transition-all'
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-brand text-white size-8 border-2 border-charcoal flex items-center justify-center font-black rotate-10 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
                  2
                </div>
                <h2 className='text-2xl font-serif font-black text-charcoal uppercase tracking-tight'>
                  Payment Method
                </h2>
              </div>

              <div className='bg-white border-4 border-charcoal p-8 shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] group'>
                <div className='flex items-center justify-between border-4 border-charcoal p-6 bg-cream'>
                  <div className='flex items-center gap-4'>
                    <div className='size-12 bg-brand border-2 border-charcoal flex items-center justify-center rotate-3'>
                      <CreditCard className='size-6 text-white' />
                    </div>
                    <div>
                      <h4 className='font-black text-sm uppercase text-charcoal'>
                        Cash on Delivery
                      </h4>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                        Pay when you receive the feast
                      </p>
                    </div>
                  </div>
                  <div className='size-6 border-4 border-charcoal rounded-full bg-brand flex items-center justify-center'>
                    <div className='size-2 bg-white rounded-full' />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* --- Right Column: Summary --- */}
          <div className='lg:col-span-5'>
            <div className='sticky top-32 space-y-8'>
              <Card className='rounded-none border-4 border-charcoal bg-white shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
                <CardHeader className='bg-charcoal text-white'>
                  <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-8 space-y-6'>
                  <div className='space-y-4 max-h-[300px] overflow-y-auto pr-2'>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between gap-4 border-b-2 border-charcoal/5 pb-4 last:border-0 last:pb-0'>
                        <div className='flex items-center gap-4'>
                          <span className='font-black text-brand bg-cream px-2 py-1 border border-charcoal/10 text-xs'>
                            {item.quantity}x
                          </span>
                          <span className='font-black text-xs uppercase text-charcoal truncate max-w-[140px]'>
                            {item.name}
                          </span>
                        </div>
                        <span className='font-black text-xs text-charcoal'>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className='pt-6 border-t-4 border-charcoal space-y-4'>
                    <div className='flex justify-between items-center text-charcoal/40 font-black text-[10px] uppercase tracking-[0.2em]'>
                      <span>Delivery Fee</span>
                      <span className='text-brand'>FREE</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-serif font-black text-2xl uppercase italic text-charcoal'>
                        Total
                      </span>
                      <span className='text-3xl font-serif font-black text-brand italic'>
                        ${totalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || items.length === 0}
                    className='w-full h-20 bg-charcoal text-white rounded-none border-4 border-charcoal font-black uppercase tracking-[0.2em] text-lg hover:bg-brand hover:border-black transition-all shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 group'>
                    {isSubmitting ? (
                      <Loader2 className='size-6 animate-spin' />
                    ) : (
                      <>
                        <Truck className='size-6 mr-3 group-hover:translate-x-12 transition-transform duration-500' />
                        Confirm Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className='bg-brand/10 border-4 border-brand border-dashed p-6 flex items-start gap-4'>
                <ShoppingCart className='size-6 text-brand shrink-0' />
                <p className='text-[10px] font-bold text-brand uppercase leading-relaxed tracking-widest'>
                  Items belong to{" "}
                  <span className='font-black underline'>
                    {items[0]?.restaurantName}
                  </span>
                  . Your delivery will be prioritized by their kitchen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
