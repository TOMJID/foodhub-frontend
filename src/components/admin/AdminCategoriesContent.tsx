"use client";

import { useEffect, useState } from "react";
import { Trash2, Tags, AlertCircle, Pizza, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
  _count?: {
    meals: number;
  };
}

export function AdminCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const json = await response.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to sync category list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          imageUrl: newImage.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Category "${newName}" forged!`);
        setNewName("");
        setNewImage("");
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to create category");
      }
    } catch {
      toast.error("Connection error. Try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to void the "${name}" tier?`)) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Category "${name}" deleted`);
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to delete category");
      }
    } catch {
      toast.error("Connection error. Try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className='space-y-16 pb-20'>
      <div className='space-y-2'>
        <div className='flex items-center gap-3 text-brand font-black uppercase tracking-[0.3em] text-[10px]'>
          <div className='size-2 bg-brand' /> Taxonomy Forge
        </div>
        <h1 className='text-5xl md:text-7xl font-serif font-black text-charcoal tracking-tighter italic leading-none'>
          Menu <span className='text-brand not-italic'>Tiers.</span>
        </h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
        {/* --- Create Section --- */}
        <div className='lg:col-span-5 space-y-8'>
          <Card className='rounded-none border-4 border-charcoal bg-white shadow-[12px_12px_0px_0px_rgba(255,87,34,1)]'>
            <CardHeader className='bg-charcoal text-white'>
              <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
                Create New Tier
              </CardTitle>
              <CardDescription className='text-white/40 text-[10px] font-black uppercase tracking-[0.2em]'>
                Define a new culinary category
              </CardDescription>
            </CardHeader>
            <CardContent className='p-8'>
              <form onSubmit={handleCreateCategory} className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-charcoal/40'>
                    Category Name
                  </label>
                  <Input
                    required
                    disabled={isCreating}
                    placeholder='E.G., ASIAN FUSION, DESSERTS...'
                    className='h-14 border-4 border-charcoal bg-cream rounded-none font-black uppercase text-xs placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:ring-4 transition-all'
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-charcoal/40'>
                    Cover Image URL (Optional)
                  </label>
                  <Input
                    disabled={isCreating}
                    placeholder='HTTPS://IMAGES.UNSPLASH.COM/...'
                    className='h-14 border-4 border-charcoal bg-cream rounded-none font-black uppercase text-xs placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:ring-4 transition-all'
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                </div>
                <Button
                  disabled={isCreating}
                  className='w-full h-16 bg-charcoal text-white rounded-none border-4 border-charcoal font-black uppercase tracking-widest text-xs hover:bg-brand hover:border-black transition-all shadow-[6px_6px_0px_0px_rgba(255,87,34,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'>
                  {isCreating ? (
                    <LoadingSpinner
                      size='sm'
                      text=''
                      brutalist={false}
                      className='p-0'
                    />
                  ) : (
                    <>
                      Forge Category <ArrowRight className='size-4 ml-3' />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className='bg-brand/10 border-4 border-brand border-dashed p-8 space-y-4'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='size-5 text-brand' />
              <h4 className='font-black text-xs uppercase text-brand tracking-widest'>
                Forge Guidelines
              </h4>
            </div>
            <p className='text-[10px] font-bold text-brand leading-relaxed uppercase tracking-widest'>
              Categories define how customers filter their cravings. Use clear,
              broad terms that multiple providers can fit into. High-quality
              imagery significantly boosts click-through rates.
            </p>
          </div>
        </div>

        {/* --- List Section --- */}
        <div className='lg:col-span-7'>
          <div className='bg-white border-4 border-charcoal shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
            <div className='p-6 border-b-4 border-charcoal'>
              <div className='flex items-center gap-3'>
                <Tags className='size-5 text-brand' />
                <h3 className='font-serif font-black text-2xl uppercase italic text-charcoal'>
                  Active Tiers
                </h3>
              </div>
            </div>
            <div className='p-0 divide-y-4 divide-charcoal/5 max-h-[700px] overflow-y-auto px-1'>
              {isLoading ? (
                <div className='py-20'>
                  <LoadingSpinner text='Scanning Catalog...' size='md' />
                </div>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className='p-6 flex items-center justify-between group hover:bg-cream/50 transition-colors'>
                    <div className='flex items-center gap-6'>
                      <div className='relative size-16 bg-cream border-2 border-charcoal overflow-hidden rotate-2 group-hover:rotate-0 transition-transform flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
                        {cat.imageUrl ? (
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <Pizza className='size-8 text-brand/20' />
                        )}
                      </div>
                      <div className='space-y-1'>
                        <h4 className='font-black text-sm uppercase text-charcoal'>
                          {cat.name}
                        </h4>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none'>
                          Used by {cat._count?.meals || 0} dishes
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='hidden md:flex flex-col items-end mr-4'>
                        <span className='size-2 bg-green-500 rounded-full' />
                        <span className='text-[8px] font-black uppercase text-gray-300 mt-1'>
                          LIVE
                        </span>
                      </div>
                      <Button
                        disabled={isDeleting === cat.id}
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        variant='ghost'
                        className='size-10 rounded-none border-2 border-charcoal hover:bg-red-500 hover:text-white transition-all opacity-80 hover:opacity-100'>
                        {isDeleting === cat.id ? (
                          <LoadingSpinner
                            size='sm'
                            text=''
                            brutalist={false}
                            className='p-0'
                          />
                        ) : (
                          <Trash2 className='size-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='py-20 text-center font-black uppercase tracking-widest text-charcoal/20'>
                  No categories forged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
