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
import { Loader2, AlertCircle } from "lucide-react";

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

export function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
}: CancelOrderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-cream border-4 border-charcoal rounded-none max-w-md shadow-[12px_12px_0px_0px_rgba(10,10,10,1)]'>
        <DialogHeader>
          <div className='flex items-center gap-4 mb-2'>
            <div className='bg-red-50 p-2 border-2 border-red-500'>
              <AlertCircle className='size-6 text-red-500' />
            </div>
            <div>
              <DialogTitle className='text-2xl font-serif font-black uppercase tracking-tighter text-charcoal'>
                Cancel Order
              </DialogTitle>
              <DialogDescription className='text-[10px] font-black uppercase tracking-widest text-red-500'>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm font-bold text-gray-600'>
            Are you sure you want to cancel this order? The restaurant might
            have already started preparing your food.
          </p>
        </div>

        <DialogFooter className='pt-4 gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            className='rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-[10px] h-12 flex-1'>
            Keep Order
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isCancelling}
            className='bg-red-500 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none transition-all flex-2'>
            {isCancelling ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              "Yes, Cancel Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
