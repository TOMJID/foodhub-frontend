"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Order } from "../types";

interface ReviewItemDialogProps {
  order: Order | null;
  onClose: () => void;
  onSelectMeal: (mealId: string, mealName: string) => void;
}

export function ReviewItemDialog({
  order,
  onClose,
  onSelectMeal,
}: ReviewItemDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className='bg-cream border-4 border-charcoal rounded-none max-w-lg shadow-[12px_12px_0px_0px_rgba(10,10,10,1)]'>
        <DialogHeader>
          <DialogTitle className='text-3xl font-serif font-black uppercase tracking-tighter text-charcoal flex items-center gap-3'>
            <MessageSquare className='size-8 text-brand fill-brand' />
            Select Item
          </DialogTitle>
          <DialogDescription className='text-[10px] font-black uppercase tracking-widest text-brand'>
            Which meal would you like to review?
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-6'>
          {order.items.map((item) => (
            <div
              key={item.id}
              className='bg-white border-4 border-charcoal p-4 group hover:bg-brand/5 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] transition-all flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='size-14 bg-cream border-2 border-charcoal overflow-hidden relative'>
                  {item.meal.imageUrl ? (
                    <Image
                      src={item.meal.imageUrl}
                      alt={item.meal.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <Star className='size-6 text-brand/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                  )}
                </div>
                <div>
                  <h4 className='font-black text-xs uppercase text-charcoal'>
                    {item.meal.name}
                  </h4>
                  <p className='text-[8px] font-bold text-gray-400 uppercase italic'>
                    Order ID: #{order.id.slice(-6)}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onSelectMeal(item.mealId, item.meal.name)}
                className='bg-charcoal text-white size-10 rounded-none border-2 border-charcoal hover:bg-brand transition-all flex items-center justify-center'>
                <ChevronRight className='size-5' />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
