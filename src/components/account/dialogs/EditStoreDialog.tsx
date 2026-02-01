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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EditStoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  isUpdating: boolean;
  editForm: {
    restaurantName: string;
    cuisineType: string;
    address: string;
    coverImageUrl: string;
  };
  setEditForm: (form: {
    restaurantName: string;
    cuisineType: string;
    address: string;
    coverImageUrl: string;
  }) => void;
}

export function EditStoreDialog({
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
  editForm,
  setEditForm,
}: EditStoreDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-cream border-4 border-charcoal rounded-none max-w-md shadow-[12px_12px_0px_0px_rgba(10,10,10,1)]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-serif font-black uppercase tracking-tighter text-charcoal'>
            Edit Store Info
          </DialogTitle>
          <DialogDescription className='text-[10px] font-black uppercase tracking-widest text-brand'>
            Update your public business profile
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 pt-4'>
          <div className='space-y-2'>
            <Label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
              Restaurant Name
            </Label>
            <Input
              value={editForm.restaurantName}
              onChange={(e) =>
                setEditForm({ ...editForm, restaurantName: e.target.value })
              }
              className='rounded-none border-2 border-charcoal bg-white h-12 font-bold focus:ring-brand'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
              Cuisine Specialty
            </Label>
            <Input
              value={editForm.cuisineType}
              onChange={(e) =>
                setEditForm({ ...editForm, cuisineType: e.target.value })
              }
              className='rounded-none border-2 border-charcoal bg-white h-12 font-bold focus:ring-brand'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
              Store Address
            </Label>
            <Input
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              className='rounded-none border-2 border-charcoal bg-white h-12 font-bold focus:ring-brand'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
              Cover Image URL
            </Label>
            <Input
              value={editForm.coverImageUrl}
              onChange={(e) =>
                setEditForm({ ...editForm, coverImageUrl: e.target.value })
              }
              className='rounded-none border-2 border-charcoal bg-white h-12 font-bold focus:ring-brand'
              placeholder='https://your-image-url.com'
            />
          </div>
        </div>

        <DialogFooter className='pt-6'>
          <Button
            variant='outline'
            onClick={onClose}
            className='rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-[10px] h-12'>
            Cancel
          </Button>
          <Button
            onClick={onUpdate}
            disabled={isUpdating}
            className='bg-brand text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none transition-all'>
            {isUpdating ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              "Save Store Info"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
