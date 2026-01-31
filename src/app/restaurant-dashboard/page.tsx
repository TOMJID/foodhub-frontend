"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Plus,
  Utensils,
  DollarSign,
  Tag,
  Trash2,
  ChevronLeft,
  ChefHat,
  Search,
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  categoryId: string;
  category?: { name: string };
}

interface UserWithExtras {
  id: string;
  role?: string;
}

const mealSchema = z.object({
  name: z.string().min(2, "Meal name must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.number().positive("Price must be a positive number."),
  categoryId: z.string().min(1, "Please select a category."),
  imageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
});

type MealFormValues = z.infer<typeof mealSchema>;

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMealsLoading, setIsMealsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (
      !isAuthPending &&
      (!session || (session.user as UserWithExtras).role !== "provider")
    ) {
      router.push("/account");
    }
  }, [session, isAuthPending, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, profileRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/providers/me"),
        ]);

        const categoriesJson = await categoriesRes.json();
        const profileJson = await profileRes.json();

        if (categoriesJson.success) setCategories(categoriesJson.data);

        if (profileJson.success && profileJson.data.id) {
          const mealsRes = await fetch(
            `/api/meals/provider/${profileJson.data.id}`,
          );
          const mealsJson = await mealsRes.json();
          if (mealsJson.success) setMeals(mealsJson.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsMealsLoading(false);
      }
    };

    if (session && (session.user as UserWithExtras).role === "provider") {
      fetchData();
    }
  }, [session]);

  if (isAuthPending || !session) {
    return (
      <div className='min-h-screen bg-cream flex items-center justify-center'>
        <Loader2 className='size-12 text-brand animate-spin' />
      </div>
    );
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const values = data as MealFormValues;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Meal added to your menu!");
        setMeals([data.data, ...meals]);
        setIsDialogOpen(false);
        form.reset();
      } else {
        toast.error(data.error || "Failed to add meal.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeal = async () => {
    if (!mealToDelete) return;

    try {
      const response = await fetch(`/api/meals/${mealToDelete}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Meal removed from menu.");
        setMeals(meals.filter((m) => m.id !== mealToDelete));
        setMealToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete meal.");
      }
    } catch {
      toast.error("Failed to delete meal. Connection error.");
    }
  };

  const filteredMeals = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-cream selection:bg-brand selection:text-white pb-20'>
      {/* --- Dashboard Header --- */}
      <header className='bg-charcoal text-white border-b-4 border-charcoal sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Link
              href='/account'
              className='size-10 bg-white/10 hover:bg-white/20 border-2 border-white/20 flex items-center justify-center transition-all group'>
              <ChevronLeft className='size-5 group-hover:-translate-x-1 transition-transform' />
            </Link>
            <div className='h-10 w-[2px] bg-white/10 hidden md:block' />
            <span className='text-2xl font-serif font-black tracking-tighter uppercase italic hidden md:block'>
              Kitchen <span className='text-brand not-italic'>Console</span>
            </span>
          </div>

          <div className='flex items-center gap-4'>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-brand hover:bg-white hover:text-charcoal text-white font-black uppercase tracking-widest text-xs h-12 px-6 rounded-none border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none'>
                  <Plus className='size-4 mr-2' />
                  Add New Meal
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-cream border-4 border-charcoal rounded-none p-0 max-w-2xl overflow-hidden shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
                <DialogHeader className='bg-charcoal text-white p-8'>
                  <DialogTitle className='font-serif font-black text-3xl uppercase tracking-tighter italic'>
                    Create Culinary Masterpiece
                  </DialogTitle>
                  <DialogDescription className='text-brand text-[10px] font-black uppercase tracking-[0.3em]'>
                    Fill in the details for your new menu item
                  </DialogDescription>
                </DialogHeader>
                <div className='p-8 max-h-[70vh] overflow-y-auto'>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form.control}
                          name='name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[10px] font-black uppercase tracking-widest'>
                                Meal Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder='E.G. TRUFFLE PASTA'
                                  className='h-12 rounded-none border-2 border-charcoal font-bold uppercase placeholder:text-gray-300'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='price'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[10px] font-black uppercase tracking-widest'>
                                Price ($)
                              </FormLabel>
                              <FormControl>
                                <div className='relative'>
                                  <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
                                  <Input
                                    {...field}
                                    type='number'
                                    step='0.01'
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                      )
                                    }
                                    className='h-12 pl-10 rounded-none border-2 border-charcoal font-bold uppercase'
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name='categoryId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[10px] font-black uppercase tracking-widest'>
                              Category
                            </FormLabel>
                            <select
                              {...field}
                              className='flex h-12 w-full border-2 border-charcoal bg-white px-3 py-2 text-sm font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'>
                              <option value='' disabled>
                                Select a category
                              </option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[10px] font-black uppercase tracking-widest'>
                              Description
                            </FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                className='min-h-[100px] w-full border-2 border-charcoal bg-white p-4 text-sm font-bold uppercase placeholder:text-gray-300 focus-visible:ring-brand resize-none'
                                placeholder='TELL THE STORY OF THIS DISH...'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='imageUrl'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-[10px] font-black uppercase tracking-widest'>
                              Image URL (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder='HTTPS://...'
                                className='h-12 rounded-none border-2 border-charcoal font-bold'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full h-14 bg-charcoal text-white font-black uppercase tracking-widest hover:bg-brand transition-all rounded-none'>
                        {isSubmitting ? (
                          <Loader2 className='animate-spin' />
                        ) : (
                          "Publish to Menu"
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 mt-12'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
          <div className='space-y-2'>
            <span className='text-brand font-black uppercase tracking-[0.3em] text-[10px]'>
              Merchant Inventory
            </span>
            <h1 className='text-5xl md:text-7xl font-serif font-black text-charcoal tracking-tighter italic leading-none'>
              Your <span className='text-brand not-italic'>Menu.</span>
            </h1>
          </div>

          <div className='relative w-full md:w-96'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
            <Input
              placeholder='FIND IN YOUR KITCHEN...'
              className='h-14 pl-12 pr-6 border-4 border-charcoal bg-white rounded-none font-black uppercase tracking-tighter focus-visible:ring-brand'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isMealsLoading ? (
          <div className='py-40 flex flex-col items-center gap-6'>
            <Loader2 className='size-20 text-brand animate-spin' />
            <p className='text-xl font-black uppercase tracking-[0.3em] text-charcoal/20 italic'>
              Inventorying supplies...
            </p>
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredMeals.map((meal) => (
              <Card
                key={meal.id}
                className='group rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(255,87,34,1)] transition-all overflow-hidden flex flex-col'>
                <div className='relative h-60 border-b-4 border-charcoal overflow-hidden shrink-0 bg-cream'>
                  {meal.imageUrl ? (
                    <Image
                      src={meal.imageUrl}
                      alt={meal.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                  ) : (
                    <div className='size-full flex items-center justify-center opacity-10'>
                      <Utensils className='size-20 text-charcoal' />
                    </div>
                  )}
                  <div className='absolute top-4 left-4 flex gap-2'>
                    <span className='bg-white border-2 border-charcoal px-2 py-1 text-[8px] font-black uppercase tracking-widest text-charcoal'>
                      {meal.category?.name || "UNCLASSIFIED"}
                    </span>
                  </div>
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => setMealToDelete(meal.id)}
                    className='absolute top-4 right-4 size-10 rounded-none border-2 border-charcoal bg-white text-charcoal hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none'>
                    <Trash2 className='size-4' />
                  </Button>
                </div>
                <CardContent className='p-6 grow flex flex-col justify-between space-y-4'>
                  <div>
                    <h3 className='text-2xl font-serif font-black text-charcoal uppercase leading-none mb-3 truncate'>
                      {meal.name}
                    </h3>
                    <p className='text-[10px] font-bold text-gray-500 leading-relaxed line-clamp-2 uppercase italic'>
                      {meal.description}
                    </p>
                  </div>
                  <div className='flex items-center justify-between pt-4 border-t-2 border-charcoal/5'>
                    <span className='text-2xl font-black text-brand'>
                      ${Number(meal.price).toFixed(2)}
                    </span>
                    <div className='flex items-center gap-1.5 opacity-30'>
                      <Tag className='size-3' />
                      <span className='text-[8px] font-black uppercase tracking-tighter'>
                        SKU-{meal.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='py-40 border-4 border-charcoal border-dashed flex flex-col items-center text-center p-12 space-y-8'>
            <div className='size-24 bg-white border-4 border-charcoal flex items-center justify-center rotate-6 shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
              <ChefHat className='size-12 text-brand' />
            </div>
            <div>
              <h2 className='text-3xl font-serif font-black text-charcoal uppercase tracking-tighter'>
                Desert in the kitchen?
              </h2>
              <p className='max-w-md mx-auto mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest leading-loose'>
                You haven&apos;t added any meals yet or your flight doesn&apos;t
                match current results. Start building your reputation by adding
                your signature dishes.
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className='bg-charcoal text-white font-black uppercase tracking-widest rounded-none h-14 px-10 border-2 border-charcoal shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] hover:bg-brand transition-all'>
              Add My First Dish
            </Button>
          </div>
        )}
      </main>

      <Dialog
        open={!!mealToDelete}
        onOpenChange={(open) => !open && setMealToDelete(null)}>
        <DialogContent className='bg-cream border-4 border-charcoal rounded-none p-0 max-w-md overflow-hidden shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
          <DialogHeader className='bg-red-500 text-white p-8 border-b-4 border-charcoal'>
            <DialogTitle className='font-serif font-black text-3xl uppercase tracking-tighter italic'>
              Remove Dish?
            </DialogTitle>
            <DialogDescription className='text-white/80 text-[10px] font-black uppercase tracking-[0.3em]'>
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          <div className='p-8 space-y-6'>
            <p className='text-charcoal font-bold uppercase tracking-tight text-sm leading-relaxed'>
              Are you sure you want to delete this masterpiece from your kitchen
              inventory?
            </p>
            <div className='flex gap-4'>
              <Button
                variant='outline'
                onClick={() => setMealToDelete(null)}
                className='flex-1 h-12 rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-xs hover:bg-charcoal hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,0.1)]'>
                Keep It
              </Button>
              <Button
                variant='destructive'
                onClick={handleDeleteMeal}
                className='flex-1 h-12 rounded-none border-2 border-charcoal bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-charcoal transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,0.2)]'>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
