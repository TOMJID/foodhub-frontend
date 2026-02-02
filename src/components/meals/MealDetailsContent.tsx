"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  Clock,
  ShieldCheck,
  ShoppingCart,
  MapPin,
  Store,
  Pizza,
  Beef,
  Soup,
  Coffee,
  IceCream,
  Cookie,
  Cake,
  Flame,
  ChefHat,
  Salad,
  Sandwich,
  Croissant,
  Utensils,
  Plus,
  Minus,
  Utensils as UtensilsIcon,
  MessageSquare,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/store/useCart";
import { toast } from "react-hot-toast";
import { CartSheet } from "@/components/cart-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MealIllustration = ({ id }: { id: string }) => {
  const icons = [
    Pizza,
    Soup,
    Beef,
    Coffee,
    IceCream,
    Cookie,
    Cake,
    Flame,
    ChefHat,
    Salad,
    Sandwich,
    Croissant,
    UtensilsIcon,
  ];

  const iconIndex = id
    ? id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      icons.length
    : 0;
  const Icon = icons[iconIndex];

  return (
    <div className='w-full h-full bg-cream flex items-center justify-center relative overflow-hidden'>
      <div
        className='absolute inset-0 opacity-[0.03] pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0a0a0a 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className='relative z-10 size-40 bg-white border-4 border-charcoal flex items-center justify-center rotate-3 shadow-[12px_12px_0px_0px_rgba(255,87,34,1)]'>
        <Icon className='size-20 text-brand' strokeWidth={2.5} />
      </div>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 border-8 border-charcoal/5 rounded-full rotate-45' />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 border-4 border-charcoal/5 rounded-full -rotate-12' />
    </div>
  );
};

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    name: string;
    image?: string | null;
  };
}

interface Meal {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  description: string | null;
  categoryId: string;
  providerId: string;
  category: { name: string };
  provider: {
    restaurantName: string;
    address: string;
    cuisineType: string;
  };
}

export function MealDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const handleAddToCart = () => {
    if (!meal) return;

    // Add multiple quantities at once
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: meal.id,
        name: meal.name,
        price: Number(meal.price),
        imageUrl: meal.imageUrl,
        restaurantId: meal.providerId,
        restaurantName: meal.provider.restaurantName,
      });
    }

    toast.success(
      `${quantity > 1 ? `${quantity}x ` : ""}${meal.name} added to basket!`,
      {
        icon: "🍱",
        style: {
          border: "3px solid #0a0a0a",
          padding: "16px",
          color: "#0a0a0a",
          fontWeight: "900",
          textTransform: "uppercase",
          borderRadius: "0",
          background: "#fff",
          boxShadow: "8px 8px 0px 0px rgba(255,87,34,1)",
        },
      },
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealRes, reviewsRes] = await Promise.all([
          fetch(`/api/meals/${id}`),
          fetch(`/api/reviews/meal/${id}`),
        ]);

        const mealJson = await mealRes.json();
        const reviewsJson = await reviewsRes.json();

        if (mealJson.success) setMeal(mealJson.data);
        if (reviewsJson.success) setReviews(reviewsJson.data);
      } catch (error) {
        console.error("Failed to fetch meal data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-cream'>
        <LoadingSpinner
          text='Preparing the details...'
          size='xl'
          className='h-screen'
        />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className='min-h-screen bg-cream flex flex-col items-center justify-center gap-8 p-6 text-center'>
        <div className='size-32 bg-white border-4 border-charcoal flex items-center justify-center rotate-6 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
          <Utensils className='size-16 text-brand' />
        </div>
        <div>
          <h1 className='text-4xl font-serif font-black text-charcoal tracking-tighter uppercase'>
            Flavor Missing
          </h1>
          <p className='text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 font-mono'>
            This dish seems to have left the kitchen.
          </p>
        </div>
        <Button
          asChild
          className='bg-brand text-white font-black uppercase tracking-widest rounded-none border-2 border-charcoal px-8 py-6 hover:bg-black transition-all shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
          <Link href='/meals'>Back to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-cream'>
      {/* --- Sticky Header --- */}
      <header className='bg-white border-b-4 border-charcoal sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <Button
            onClick={() => router.back()}
            variant='ghost'
            className='group font-black uppercase tracking-widest text-xs flex items-center gap-2 px-0 hover:bg-transparent'>
            <div className='size-10 border-2 border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all'>
              <ChevronLeft className='size-5' />
            </div>
            Back
          </Button>

          <div className='flex items-center gap-4'>
            <Badge className='bg-charcoal text-white rounded-none font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 hidden md:block'>
              AUTHENTIC {meal.category.name}
            </Badge>
            <CartSheet />
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start'>
          {/* --- Image Section --- */}
          <div className='lg:col-span-7 space-y-8'>
            <div className='relative aspect-video border-[6px] border-charcoal bg-white shadow-[12px_12px_0px_0px_rgba(255,87,34,1)] overflow-hidden'>
              {meal.imageUrl ? (
                <Image
                  src={meal.imageUrl}
                  alt={meal.name}
                  fill
                  className='object-cover'
                  priority
                />
              ) : (
                <MealIllustration id={meal.id} />
              )}
              <div className='absolute top-6 left-6 flex flex-col gap-3'>
                <Badge className='w-fit bg-white text-charcoal border-2 border-charcoal rounded-none px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
                  {meal.category.name}
                </Badge>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              <div className='bg-white border-2 border-charcoal p-4 flex flex-col items-center gap-2'>
                <Clock className='size-5 text-brand' />
                <span className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                  25-30 MIN
                </span>
              </div>
              <div className='bg-white border-2 border-charcoal p-4 flex flex-col items-center gap-2'>
                <Star
                  className={`size-5 ${averageRating > 0 ? "text-brand fill-brand" : "text-gray-200"}`}
                />
                <span className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                  {averageRating > 0
                    ? `${averageRating.toFixed(1)} (${reviews.length})`
                    : "NO REVIEWS"}
                </span>
              </div>
              <div className='bg-white border-2 border-charcoal p-4 flex flex-col items-center gap-2 col-span-2 md:col-span-1'>
                <ShieldCheck className='size-5 text-brand' />
                <span className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                  QUALITY CHECKED
                </span>
              </div>
            </div>
          </div>

          {/* --- Content Section --- */}
          <div className='lg:col-span-5 space-y-10'>
            <div className='space-y-4'>
              <h1 className='text-5xl md:text-7xl font-serif font-black text-charcoal tracking-tighter leading-[0.9] uppercase italic'>
                {meal.name}
              </h1>
              <div className='flex items-center gap-4 py-2'>
                <div className='size-3 bg-brand animate-pulse' />
                <p className='text-3xl font-black text-brand tracking-tighter font-mono'>
                  ${Number(meal.price).toFixed(2)}
                </p>
              </div>
            </div>

            <p className='text-lg font-medium text-gray-600 leading-relaxed border-l-4 border-charcoal/10 pl-6'>
              {meal.description ||
                "Indulge in this chef-crafted masterpiece. Every ingredient is sourced locally and prepared fresh for the ultimate flavor experience."}
            </p>

            {/* --- Restaurant Info --- */}
            <Card className='rounded-none border-4 border-charcoal bg-cream shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
              <CardContent className='p-6 space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='size-12 bg-charcoal border-2 border-charcoal flex items-center justify-center'>
                    <Store className='size-6 text-white' />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-brand uppercase tracking-[0.2em]'>
                      Prepared by
                    </p>
                    <h3 className='font-serif font-black text-lg text-charcoal uppercase'>
                      {meal.provider.restaurantName}
                    </h3>
                  </div>
                </div>
                <Separator className='bg-charcoal/10' />
                <div className='flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                  <MapPin className='size-4 text-brand shrink-0' />
                  <span className='truncate'>{meal.provider.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* --- Action Section --- */}
            <div className='pt-6 space-y-6'>
              <div className='flex items-center justify-between bg-white border-4 border-charcoal p-4 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)]'>
                <div className='flex items-center gap-6'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-10 border-2 border-charcoal rounded-none hover:bg-charcoal hover:text-white'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className='size-4' />
                  </Button>
                  <span className='text-2xl font-black text-charcoal w-8 text-center'>
                    {quantity}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-10 border-2 border-charcoal rounded-none hover:bg-charcoal hover:text-white'
                    onClick={() => setQuantity(quantity + 1)}>
                    <Plus className='size-4' />
                  </Button>
                </div>
                <div className='text-right'>
                  <p className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>
                    Subtotal
                  </p>
                  <p className='text-xl font-black text-charcoal tracking-tight font-mono'>
                    ${(Number(meal.price) * quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className='w-full h-20 bg-charcoal text-white rounded-none border-4 border-charcoal font-black uppercase tracking-[0.15em] text-lg hover:bg-brand hover:border-black transition-all shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] active:translate-x-1 active:translate-y-1 active:shadow-none group'>
                <ShoppingCart className='size-6 mr-3 group-hover:scale-110 transition-transform' />
                Add to Cart & Order
              </Button>
            </div>
          </div>
        </div>

        {/* --- Reviews Section --- */}
        <section className='mt-24 space-y-12'>
          <div className='flex items-end justify-between border-b-8 border-charcoal pb-6'>
            <div className='space-y-2'>
              <span className='text-brand font-black uppercase tracking-[0.3em] text-[10px]'>
                Community Voice
              </span>
              <h2 className='text-5xl md:text-7xl font-serif font-black text-charcoal tracking-tighter italic leading-none'>
                Kitchen <span className='text-brand not-italic'>Talk.</span>
              </h2>
            </div>
            <div className='text-right hidden md:block'>
              <div className='flex items-center gap-1 justify-end mb-1'>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`size-4 ${Math.round(averageRating) >= s ? "text-brand fill-brand" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className='text-[10px] font-black uppercase tracking-widest text-charcoal/40'>
                {reviews.length} Reviews logged
              </p>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] overflow-hidden flex flex-col'>
                  <CardContent className='p-8 space-y-6 grow'>
                    <div className='flex justify-between items-start'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-10 border-2 border-charcoal rounded-none'>
                          <AvatarImage
                            src={review.customer.image || ""}
                            className='object-cover'
                          />
                          <AvatarFallback className='bg-brand text-white font-black text-xs uppercase'>
                            {review.customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-black text-xs uppercase text-charcoal leading-none mb-1'>
                            {review.customer.name}
                          </p>
                          <p className='text-[8px] font-bold text-gray-400 uppercase tracking-widest'>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className='bg-charcoal text-white px-2 py-1 flex items-center gap-1'>
                        <span className='text-[10px] font-black'>
                          {review.rating}
                        </span>
                        <Star className='size-2.5 fill-brand text-brand' />
                      </div>
                    </div>

                    <div className='relative'>
                      <MessageSquare className='absolute -left-2 -top-2 size-8 text-brand/10 -rotate-12' />
                      <p className='relative z-10 text-sm font-bold text-charcoal leading-relaxed uppercase italic'>
                        &quot;
                        {review.comment ||
                          "AMAZING FLAVOR, HIGHLY RECOMMENDED!"}
                        &quot;
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className='py-20 border-4 border-charcoal border-dashed bg-white/50 flex flex-col items-center justify-center text-center p-12 space-y-6'>
              <div className='size-16 bg-white border-2 border-charcoal flex items-center justify-center rotate-6'>
                <MessageSquare className='size-8 text-charcoal/10' />
              </div>
              <div>
                <h3 className='text-2xl font-serif font-black text-charcoal uppercase'>
                  The silence is delicious
                </h3>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mt-2'>
                  Be the first to share your experience after ordering!
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* --- Simple Footer --- */}
      <footer className='mt-20 border-t-4 border-charcoal bg-white py-12'>
        <div className='max-w-7xl mx-auto px-6 text-center'>
          <p className='text-[10px] font-black text-charcoal uppercase tracking-[0.4em]'>
            Authentic Flavor Guaranteed • FoodHub Culinary Network
          </p>
        </div>
      </footer>
    </div>
  );
}
