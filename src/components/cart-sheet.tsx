"use client";

import { useCart } from "@/store/useCart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, Utensils } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function CartSheet() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleCheckout = () => {
    if (!session) {
      toast.error("Please login to place an order");
      router.push("/login");
      return;
    }

    if (items.length === 0) return;

    // Check if items are from multiple restaurants
    const restaurantIds = new Set(items.map((i) => i.restaurantId));
    if (restaurantIds.size > 1) {
      toast.error(
        "Orders must be from a single restaurant at a time. Please clear items from other kitchens.",
      );
      return;
    }

    router.push("/checkout");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='relative border-2 border-charcoal rounded-none hover:bg-brand hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'>
          <ShoppingCart className='size-5' />
          {mounted && totalItems() > 0 && (
            <span className='absolute -top-2 -right-2 bg-brand text-white text-[10px] font-black size-5 flex items-center justify-center border-2 border-charcoal'>
              {totalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className='bg-cream border-l-4 border-charcoal p-0 sm:max-w-md flex flex-col'>
        <SheetHeader className='p-6 bg-charcoal text-white'>
          <SheetTitle className='text-3xl font-serif font-black tracking-tighter italic flex items-center gap-2'>
            Your <span className='text-brand not-italic'>Basket</span>
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto p-6 space-y-6'>
          {items.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30'>
              <Utensils className='size-16' />
              <p className='font-black uppercase tracking-widest text-sm'>
                Your kitchen is empty
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className='flex gap-4 bg-white border-2 border-charcoal p-4 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
                <div className='relative size-20 border-2 border-charcoal shrink-0 bg-cream'>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='size-full flex items-center justify-center opacity-10'>
                      <Utensils className='size-8' />
                    </div>
                  )}
                </div>
                <div className='flex-1 flex flex-col justify-between'>
                  <div>
                    <h4 className='font-serif font-black text-charcoal uppercase leading-none truncate'>
                      {item.name}
                    </h4>
                    <p className='text-brand font-black mt-1'>
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className='flex items-center justify-between mt-2'>
                    <div className='flex items-center border-2 border-charcoal overflow-hidden'>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className='p-1 hover:bg-brand hover:text-white transition-colors'>
                        <Minus className='size-3' />
                      </button>
                      <span className='px-3 font-black text-xs border-x-2 border-charcoal'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className='p-1 hover:bg-brand hover:text-white transition-colors'>
                        <Plus className='size-3' />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className='text-charcoal/40 hover:text-red-500 transition-colors'>
                      <Trash2 className='size-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className='p-6 bg-white border-t-4 border-charcoal flex-col gap-4 sm:flex-col'>
            <div className='flex items-center justify-between w-full'>
              <span className='text-[10px] font-black uppercase tracking-widest text-charcoal/40'>
                Subtotal
              </span>
              <span className='text-3xl font-serif font-black text-brand italic'>
                ${totalPrice().toFixed(2)}
              </span>
            </div>
            <div className='flex gap-4 w-full'>
              <Button
                variant='outline'
                onClick={clearCart}
                className='flex-1 rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-xs h-14 hover:bg-red-500 hover:text-white transition-all'>
                Clear
              </Button>
              <Button
                onClick={handleCheckout}
                className='flex-3 bg-brand text-white rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-xs h-14 hover:bg-charcoal transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'>
                Secure Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
