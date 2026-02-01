"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  isUpdating: boolean;
  reviewingMeal: {
    mealId: string;
    mealName: string;
  } | null;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
}

export function ReviewDialog({
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
  reviewingMeal,
  rating,
  setRating,
  comment,
  setComment,
}: ReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-cream border-4 border-charcoal rounded-none max-w-md shadow-[12px_12px_0px_0px_rgba(10,10,10,1)]'>
        <DialogHeader>
          <DialogTitle className='text-3xl font-serif font-black uppercase tracking-tighter text-charcoal flex items-center gap-3'>
            <Star className='size-8 text-brand fill-brand' />
            Meal Review
          </DialogTitle>
          <DialogDescription className='text-[10px] font-black uppercase tracking-widest text-brand'>
            How was your {reviewingMeal?.mealName}?
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-8 py-6'>
          <div className='space-y-4'>
            <p className='text-[10px] font-black uppercase tracking-widest text-charcoal/50 text-center'>
              Select Your Rating
            </p>
            <div className='flex flex-col items-center gap-6'>
              <div className='flex justify-center items-center gap-3'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onMouseEnter={() => setRating(star)}
                    onClick={() => setRating(star)}
                    className={`group size-14 transition-all duration-300 transform ${
                      rating >= star
                        ? "scale-110"
                        : "scale-100 opacity-40 hover:opacity-100"
                    }`}>
                    <Star
                      className={`size-full transition-all duration-300 ${
                        rating >= star
                          ? "fill-brand stroke-charcoal stroke-[3px] drop-shadow-[0_4px_0_rgba(10,10,10,1)]"
                          : "fill-white/20 stroke-charcoal stroke-[2px]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-end'>
              <label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                Share Your Experience
              </label>
              <span className='text-[8px] font-black uppercase text-gray-400'>
                {comment.length} / 200
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='w-full h-32 p-4 bg-white border-4 border-charcoal rounded-none resize-none font-bold text-sm focus:ring-0 focus:border-brand transition-colors'
              placeholder='Tell others how delicious it was...'
              maxLength={200}
            />
          </div>
        </div>

        <DialogFooter className='pt-2'>
          <Button
            variant='outline'
            onClick={onClose}
            className='rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-[10px] h-12 hover:bg-cream-dark transition-all'>
            Cancel
          </Button>
          <Button
            onClick={onUpdate}
            disabled={isUpdating || !rating}
            className='bg-brand text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none transition-all disabled:opacity-50'>
            {isUpdating ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              "Post Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
