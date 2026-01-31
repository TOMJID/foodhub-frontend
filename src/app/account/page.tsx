"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  LogOut,
  Mail,
  Calendar,
  Store,
  ChefHat,
  Utensils,
  Star,
  MessageSquare,
  ChevronRight,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

interface UserWithExtras {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  mealId: string;
  quantity: number;
  priceAtTime: number;
  meal: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl?: string | null;
  meals: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    isAvailable: boolean;
    category: {
      name: string;
    };
  }[];
}

function AccountPageContent() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [providerProfile, setProviderProfile] =
    useState<ProviderProfile | null>(null);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  // Edit Profile States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    restaurantName: "",
    cuisineType: "",
    address: "",
    coverImageUrl: "",
  });

  // Review states
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [reviewingMeal, setReviewingMeal] = useState<{
    mealId: string;
    mealName: string;
  } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Cancel order state
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancellingOrderId(orderToCancel);
    try {
      const response = await fetch(`/api/orders/cancel/${orderToCancel}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Order cancelled successfully");
        // Update the orders list with the cancelled status
        setOrders(
          orders.map((o) =>
            o.id === orderToCancel ? { ...o, status: "cancelled" } : o,
          ),
        );
        setOrderToCancel(null);
      } else {
        toast.error(data.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/my", {
          credentials: "include",
        });
        const json = await response.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  useEffect(() => {
    const fetchProviderProfile = async () => {
      setIsProviderLoading(true);
      try {
        const response = await fetch("/api/providers/me", {
          credentials: "include",
        });
        const json = await response.json();
        if (json.success) {
          setProviderProfile(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch provider profile:", error);
      } finally {
        setIsProviderLoading(false);
      }
    };

    if (session && (session.user as UserWithExtras).role === "provider") {
      fetchProviderProfile();
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className='min-h-screen bg-cream'>
        <LoadingSpinner
          text='Loading Account...'
          size='xl'
          className='h-screen'
        />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as UserWithExtras;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const openEditDialog = () => {
    if (providerProfile) {
      setEditForm({
        restaurantName: providerProfile.restaurantName,
        cuisineType: providerProfile.cuisineType,
        address: providerProfile.address,
        coverImageUrl: providerProfile.coverImageUrl || "",
      });
      setIsEditProfileOpen(true);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const response = await fetch("/api/providers/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
        setProviderProfile({
          ...providerProfile!,
          ...editForm,
        });
        setIsEditProfileOpen(false);
      } else {
        toast.error(data.error || "Failed to update profile.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const submitReview = async () => {
    if (!reviewingMeal) return;

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealId: reviewingMeal.mealId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted! Thank you 🔥");
        setReviewingMeal(null);
        setRating(5);
        setComment("");
      } else {
        toast.error(data.error || "Failed to submit review.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className='min-h-screen bg-cream selection:bg-brand selection:text-white'>
      <header className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-charcoal'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <Link href='/' className='group'>
            <span className='text-3xl font-serif font-black tracking-tighter text-charcoal group-hover:text-brand transition-colors'>
              FOOD
              <span className='text-brand group-hover:text-charcoal transition-colors'>
                HUB
              </span>
            </span>
          </Link>

          <Button
            variant='ghost'
            onClick={handleLogout}
            className='flex items-center gap-2 font-black uppercase tracking-widest text-charcoal hover:bg-brand hover:text-white transition-all border-2 border-transparent hover:border-charcoal rounded-none'>
            <LogOut className='size-4' />
            Logout
          </Button>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 pt-32 pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
          <div className='lg:col-span-1 space-y-8'>
            <div className='bg-white border-4 border-charcoal p-6 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
              <div className='text-center space-y-4'>
                <Avatar className='size-24 mx-auto border-4 border-charcoal shadow-[4px_4px_0px_0px_rgba(255,87,34,1)] rounded-none'>
                  <AvatarImage
                    src={user.image || ""}
                    className='rounded-none object-cover'
                  />
                  <AvatarFallback className='bg-brand text-white font-black text-3xl rounded-none'>
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-2xl font-serif font-black text-charcoal leading-tight'>
                    {user.name}
                  </h2>
                  <Badge className='mt-2 bg-charcoal text-white rounded-none uppercase text-[10px] font-black tracking-widest border-none px-3 py-1'>
                    {user.role}
                  </Badge>
                </div>
              </div>

              <Separator className='my-6 bg-charcoal/10' />

              <div className='space-y-4'>
                <div className='flex items-center gap-3 text-sm font-bold text-gray-600'>
                  <Mail className='size-4 text-brand shrink-0' />
                  <span className='truncate'>{user.email}</span>
                </div>
                <div className='flex items-center gap-3 text-sm font-bold text-gray-600'>
                  <Calendar className='size-4 text-brand shrink-0' />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {user.role === "provider" && (
                  <Button
                    asChild
                    className='w-full bg-brand text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:bg-white hover:text-brand transition-all mt-4'>
                    <Link
                      href='/restaurant-dashboard'
                      className='flex items-center gap-2'>
                      <ChefHat className='size-4' />
                      Manage Kitchen
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className='lg:col-span-3'>
            <h1 className='text-5xl font-serif font-black text-charcoal tracking-tighter mb-8 italic'>
              Dashboard
            </h1>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'>
              <TabsList className='bg-charcoal p-1 rounded-none h-auto flex flex-wrap lg:flex-nowrap gap-1'>
                <TabsTrigger
                  value='profile'
                  className='rounded-none grow py-3 font-black uppercase tracking-widest text-[10px] text-white/50 data-[state=active]:bg-brand data-[state=active]:text-white hover:text-white transition-all'>
                  <User className='size-4 mr-2' />
                  Profile
                </TabsTrigger>
                {user.role === "provider" && (
                  <TabsTrigger
                    value='provider'
                    className='rounded-none grow py-3 font-black uppercase tracking-widest text-[10px] text-white/50 data-[state=active]:bg-brand data-[state=active]:text-white hover:text-white transition-all'>
                    <Store className='size-4 mr-2' />
                    Store Info
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value='orders'
                  className='rounded-none grow py-3 font-black uppercase tracking-widest text-[10px] text-white/50 data-[state=active]:bg-brand data-[state=active]:text-white hover:text-white transition-all'>
                  <Package className='size-4 mr-2' />
                  Orders
                </TabsTrigger>
              </TabsList>

              <div className='mt-8'>
                <TabsContent value='profile' className='space-y-8'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
                      <CardHeader>
                        <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter text-charcoal'>
                          Account Overview
                        </CardTitle>
                        <CardDescription className='text-[10px] font-black uppercase tracking-[0.2em] text-brand'>
                          Verified Profile Details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='grid grid-cols-1 gap-8'>
                        <div className='space-y-4'>
                          <div className='space-y-1'>
                            <p className='text-[10px] font-black uppercase text-gray-400'>
                              Full Name
                            </p>
                            <p className='font-bold text-charcoal'>
                              {user.name}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            <p className='text-[10px] font-black uppercase text-gray-400'>
                              Email Address
                            </p>
                            <p className='font-bold text-charcoal'>
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {user.role !== "provider" && (
                          <div className='bg-cream border-2 border-charcoal border-dashed p-6 flex flex-col justify-center items-center text-center gap-4'>
                            <div className='size-12 bg-white border-2 border-charcoal flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]'>
                              <Store className='size-6 text-brand' />
                            </div>
                            <div className='space-y-1'>
                              <p className='text-[10px] font-black uppercase text-charcoal'>
                                Partner with us
                              </p>
                              <p className='text-xs font-medium text-gray-500'>
                                Own a kitchen? Start selling on FoodHub today.
                              </p>
                            </div>
                            <Button
                              asChild
                              className='w-full bg-charcoal text-white font-black uppercase tracking-widest text-[8px] h-10 rounded-none border-2 border-charcoal hover:bg-brand transition-all'>
                              <Link href='/become-provider'>
                                Become a Provider
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {user.role === "provider" && (
                      <Card className='rounded-none border-4 border-charcoal bg-charcoal text-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
                        <CardHeader>
                          <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
                            Kitchen Statistics
                          </CardTitle>
                          <CardDescription className='text-brand text-[10px] font-black uppercase tracking-[0.2em]'>
                            Live Menu Status
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-8'>
                          <div className='flex items-center gap-6'>
                            <div className='size-16 bg-white border-4 border-brand flex items-center justify-center rotate-3'>
                              <Utensils className='size-8 text-charcoal' />
                            </div>
                            <div>
                              <p className='text-[10px] font-black uppercase tracking-widest text-white/50'>
                                Active Meals
                              </p>
                              <p className='text-4xl font-serif font-black leading-none'>
                                {isProviderLoading
                                  ? "..."
                                  : providerProfile?.meals.length || 0}
                              </p>
                            </div>
                          </div>
                          <Button
                            asChild
                            className='w-full bg-brand text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-white hover:bg-white hover:text-brand transition-all'>
                            <Link href='/restaurant-dashboard'>
                              Open Management Console
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {user.role === "provider" && (
                  <TabsContent value='provider' className='space-y-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                      {/* Store Overview */}
                      <Card className='lg:col-span-2 rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
                        <CardHeader className='border-b-4 border-charcoal bg-charcoal text-white'>
                          <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
                            Restaurant Details
                          </CardTitle>
                          <CardDescription className='text-brand text-[10px] font-black uppercase tracking-[0.2em]'>
                            Your public business profile
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='pt-8 space-y-8'>
                          {isProviderLoading ? (
                            <div className='py-12 flex justify-center'>
                              <LoadingSpinner
                                size='lg'
                                text='Loading Store...'
                              />
                            </div>
                          ) : providerProfile ? (
                            <>
                              <div className='relative h-48 border-4 border-charcoal overflow-hidden group bg-cream'>
                                {providerProfile.coverImageUrl ? (
                                  <Image
                                    src={providerProfile.coverImageUrl}
                                    alt={providerProfile.restaurantName}
                                    fill
                                    className='object-cover'
                                  />
                                ) : (
                                  <div className='size-full flex flex-col items-center justify-center opacity-20'>
                                    <Store className='size-12' />
                                    <p className='font-black uppercase text-[10px] mt-2'>
                                      No Cover Image
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='space-y-6'>
                                  <div className='space-y-1'>
                                    <p className='text-[10px] font-black uppercase text-gray-400'>
                                      Restaurant Name
                                    </p>
                                    <p className='text-2xl font-serif font-black text-charcoal'>
                                      {providerProfile.restaurantName}
                                    </p>
                                  </div>
                                  <div className='space-y-1'>
                                    <p className='text-[10px] font-black uppercase text-gray-400'>
                                      Cuisine Specialty
                                    </p>
                                    <Badge className='bg-brand text-white border-charcoal border-2 rounded-none uppercase text-[10px] font-black px-4 py-1'>
                                      {providerProfile.cuisineType}
                                    </Badge>
                                  </div>
                                </div>
                                <div className='space-y-6'>
                                  <div className='space-y-1'>
                                    <p className='text-[10px] font-black uppercase text-gray-400'>
                                      Location Address
                                    </p>
                                    <p className='font-bold text-charcoal'>
                                      {providerProfile.address}
                                    </p>
                                  </div>
                                  <div className='p-4 bg-cream border-2 border-charcoal border-dashed'>
                                    <div className='flex items-center gap-2 mb-2'>
                                      <Star className='size-3 text-brand fill-brand' />
                                      <p className='text-[10px] font-black uppercase text-charcoal'>
                                        Store Health
                                      </p>
                                    </div>
                                    <p className='text-[8px] font-bold text-gray-500 uppercase'>
                                      Your store is live and visible to all
                                      customers.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className='py-12 text-center space-y-4'>
                              <AlertCircle className='size-12 text-brand mx-auto' />
                              <p className='font-black uppercase text-charcoal'>
                                No profile found
                              </p>
                              <Button
                                asChild
                                className='rounded-none bg-charcoal text-white font-black uppercase tracking-widest text-[10px]'>
                                <Link href='/become-provider'>
                                  Create Profile
                                </Link>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Store Side Stats */}
                      <div className='space-y-8'>
                        <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
                          <CardHeader className='pb-2'>
                            <CardTitle className='font-black uppercase text-xs tracking-widest text-charcoal'>
                              Quick Actions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='space-y-4'>
                            <Button
                              asChild
                              className='w-full bg-brand text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none transition-all'>
                              <Link href='/restaurant-dashboard'>
                                <ChefHat className='size-4 mr-2' />
                                Kitchen Console
                              </Link>
                            </Button>
                            <Button
                              variant='outline'
                              onClick={openEditDialog}
                              className='w-full border-2 border-charcoal font-black uppercase tracking-widest text-[10px] h-12 rounded-none hover:bg-charcoal hover:text-white transition-all'>
                              Edit Store Info
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className='rounded-none border-4 border-charcoal bg-charcoal text-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
                          <CardHeader>
                            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-brand'>
                              Menu Stats
                            </p>
                            <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
                              Inventory
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className='flex items-center justify-between border-b border-white/10 pb-4 mb-4'>
                              <span className='text-[10px] font-black uppercase text-white/50'>
                                Total Meals
                              </span>
                              <span className='text-3xl font-serif font-black text-brand'>
                                {providerProfile?.meals.length || 0}
                              </span>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-[10px] font-black uppercase text-white/50'>
                                Available
                              </span>
                              <span className='text-xl font-bold'>
                                {providerProfile?.meals.filter(
                                  (m) => m.isAvailable,
                                ).length || 0}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value='orders'>
                  <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    <CardHeader>
                      <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter text-charcoal'>
                        Order History
                      </CardTitle>
                      <CardDescription className='text-[10px] font-black uppercase tracking-[0.2em] text-brand'>
                        Your culinary journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isOrdersLoading ? (
                        <div className='py-20'>
                          <LoadingSpinner
                            text='Fetching your meals...'
                            size='lg'
                          />
                        </div>
                      ) : orders.length > 0 ? (
                        <div className='space-y-6'>
                          {orders.map((order) => (
                            <div
                              key={order.id}
                              className='border-4 border-charcoal p-4 group hover:bg-cream transition-colors'>
                              <div className='flex justify-between items-start mb-4'>
                                <div>
                                  <p className='text-[10px] font-black uppercase text-gray-400'>
                                    Order ID
                                  </p>
                                  <p className='font-black text-xs text-charcoal'>
                                    #{order.id.slice(-8).toUpperCase()}
                                  </p>
                                </div>
                                <Badge className='bg-brand text-white border-none rounded-none uppercase text-[8px] font-black px-2 py-1'>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className='flex justify-between items-end'>
                                <div>
                                  <p className='text-[10px] font-black uppercase text-gray-400'>
                                    Total Amount
                                  </p>
                                  <p className='text-lg font-black text-charcoal'>
                                    ${Number(order.totalAmount).toFixed(2)}
                                  </p>
                                </div>
                                <div className='flex flex-col items-end gap-2'>
                                  {order.status === "delivered" && (
                                    <Button
                                      onClick={() => setReviewingOrder(order)}
                                      size='sm'
                                      className='bg-brand text-white border-2 border-charcoal rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-brand transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none'>
                                      <Star className='size-3 mr-1.5' />
                                      Review Items
                                    </Button>
                                  )}
                                  {order.status === "placed" && (
                                    <Button
                                      onClick={() => setOrderToCancel(order.id)}
                                      size='sm'
                                      variant='outline'
                                      className='border-2 border-red-500 text-red-600 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all'>
                                      <XCircle className='size-3 mr-1.5' />
                                      Cancel
                                    </Button>
                                  )}
                                  <Button
                                    asChild
                                    variant='outline'
                                    size='sm'
                                    className='border-2 border-charcoal rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all'>
                                    <Link href={`/orders/${order.id}`}>
                                      View Details
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-20 space-y-6'>
                          <div className='size-20 bg-cream border-4 border-charcoal border-dashed mx-auto flex items-center justify-center'>
                            <Package className='size-8 text-charcoal/20' />
                          </div>
                          <div>
                            <p className='text-xl font-black text-charcoal uppercase tracking-tighter'>
                              No orders yet
                            </p>
                            <p className='text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest'>
                              Hungry? Start exploring our menu!
                            </p>
                          </div>
                          <Button
                            asChild
                            className='bg-brand text-white font-black uppercase tracking-widest rounded-none border-2 border-charcoal hover:bg-white hover:text-brand transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
                            <Link href='/meals'>Browse Meals</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* --- Review Order Dialog (Pick Meal) --- */}
      <Dialog
        open={!!reviewingOrder}
        onOpenChange={(open) => !open && setReviewingOrder(null)}>
        <DialogContent className='bg-cream border-4 border-charcoal rounded-none p-0 max-w-md overflow-hidden shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
          <DialogHeader className='bg-charcoal text-white p-8'>
            <DialogTitle className='font-serif font-black text-3xl uppercase tracking-tighter italic'>
              Review Your Feast
            </DialogTitle>
            <DialogDescription className='text-brand text-[10px] font-black uppercase tracking-[0.3em]'>
              Select a dish to rate your experience
            </DialogDescription>
          </DialogHeader>
          <div className='p-6 space-y-4 max-h-[60vh] overflow-y-auto'>
            {reviewingOrder?.items.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between bg-white border-2 border-charcoal p-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(255,87,34,1)] transition-all'>
                <div className='flex items-center gap-4'>
                  <div className='size-12 bg-cream border-2 border-charcoal relative overflow-hidden'>
                    {item.meal.imageUrl ? (
                      <Image
                        src={item.meal.imageUrl}
                        alt={item.meal.name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='size-full flex items-center justify-center opacity-10'>
                        <Utensils className='size-6 text-charcoal' />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className='font-black text-xs uppercase text-charcoal'>
                      {item.meal.name}
                    </h4>
                    <p className='text-[8px] font-bold text-gray-400 uppercase italic'>
                      Order ID: #{reviewingOrder.id.slice(-6)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    setReviewingMeal({
                      mealId: item.mealId,
                      mealName: item.meal.name,
                    })
                  }
                  className='bg-charcoal text-white size-10 rounded-none border-2 border-charcoal hover:bg-brand transition-all flex items-center justify-center'>
                  <ChevronRight className='size-5' />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Submit Review Dialog --- */}
      <Dialog
        open={!!reviewingMeal}
        onOpenChange={(open) => !open && setReviewingMeal(null)}>
        <DialogContent className='bg-cream border-4 border-charcoal rounded-none p-0 max-w-md overflow-hidden shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
          <DialogHeader className='bg-brand text-white p-8'>
            <DialogTitle className='font-serif font-black text-3xl uppercase tracking-tighter italic'>
              How was the {reviewingMeal?.mealName}?
            </DialogTitle>
            <DialogDescription className='text-white/80 text-[10px] font-black uppercase tracking-[0.3em]'>
              Your feedback fuels the kitchen
            </DialogDescription>
          </DialogHeader>
          <div className='p-8 space-y-8'>
            <div className='space-y-4'>
              <p className='text-[10px] font-black uppercase tracking-widest text-charcoal/50 text-center'>
                Select Your Rating
              </p>
              <div className='flex justify-center gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`size-12 border-4 border-charcoal flex items-center justify-center transition-all ${rating >= star ? "bg-brand text-white" : "bg-white text-gray-200"}`}>
                    <Star
                      className={`size-6 ${rating >= star ? "fill-white" : "fill-transparent"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <p className='text-[10px] font-black uppercase tracking-widest text-charcoal/50 flex items-center gap-2'>
                <MessageSquare className='size-3' /> Leave a comment (Optional)
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='TELL US WHAT YOU THOUGHT...'
                className='w-full min-h-[120px] bg-white border-4 border-charcoal p-4 font-black uppercase text-xs placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-brand/20 resize-none'
              />
            </div>

            <Button
              disabled={isSubmittingReview}
              onClick={submitReview}
              className='w-full h-14 bg-charcoal text-white font-black uppercase tracking-widest rounded-none border-4 border-charcoal shadow-[6px_6px_0px_0px_rgba(255,87,34,1)] hover:shadow-none hover:bg-brand transition-all active:translate-x-1 active:translate-y-1'>
              {isSubmittingReview ? (
                <LoadingSpinner
                  size='sm'
                  text=''
                  brutalist={false}
                  className='p-0'
                />
              ) : (
                "Dispatch Review"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={!!orderToCancel}
        onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <DialogContent className='bg-cream border-4 border-charcoal rounded-none p-0 max-w-md overflow-hidden shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
          <DialogHeader className='bg-red-500 text-white p-8'>
            <div className='flex items-center gap-4'>
              <div className='size-14 bg-white border-4 border-white flex items-center justify-center rotate-3'>
                <AlertCircle className='size-8 text-red-500' />
              </div>
              <div>
                <DialogTitle className='font-serif font-black text-2xl uppercase tracking-tighter italic'>
                  Cancel Order?
                </DialogTitle>
                <DialogDescription className='text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mt-1'>
                  This action cannot be undone
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className='p-8 space-y-6'>
            <p className='text-sm font-bold text-charcoal/70'>
              Are you sure you want to cancel this order? Your order will be
              voided and you will need to place a new order if you change your
              mind.
            </p>
            <DialogFooter className='flex gap-4 sm:gap-4'>
              <Button
                variant='outline'
                onClick={() => setOrderToCancel(null)}
                className='flex-1 h-12 rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-xs hover:bg-charcoal hover:text-white transition-all'>
                Keep Order
              </Button>
              <Button
                onClick={confirmCancelOrder}
                disabled={cancellingOrderId !== null}
                className='flex-1 h-12 bg-red-500 text-white rounded-none border-2 border-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all'>
                {cancellingOrderId ? (
                  <>
                    <LoadingSpinner
                      size='sm'
                      text=''
                      brutalist={false}
                      className='p-0 mr-2'
                    />
                    Voiding...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Edit Store Info Dialog --- */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className='bg-cream border-4 border-charcoal rounded-none p-0 max-w-lg overflow-hidden shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
          <DialogHeader className='bg-charcoal text-white p-8'>
            <DialogTitle className='font-serif font-black text-3xl uppercase tracking-tighter italic'>
              Edit Store Profile
            </DialogTitle>
            <DialogDescription className='text-brand text-[10px] font-black uppercase tracking-[0.3em]'>
              Update your business identity
            </DialogDescription>
          </DialogHeader>
          <div className='p-8 space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                  Restaurant Name
                </Label>
                <Input
                  value={editForm.restaurantName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, restaurantName: e.target.value })
                  }
                  className='h-12 border-2 border-charcoal rounded-none font-bold focus-visible:ring-brand'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                  Cuisine Type
                </Label>
                <Input
                  value={editForm.cuisineType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cuisineType: e.target.value })
                  }
                  className='h-12 border-2 border-charcoal rounded-none font-bold focus-visible:ring-brand'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-[10px] font-black uppercase tracking-widest text-charcoal'>
                  Address
                </Label>
                <Input
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className='h-12 border-2 border-charcoal rounded-none font-bold focus-visible:ring-brand'
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
                  className='h-12 border-2 border-charcoal rounded-none font-bold focus-visible:ring-brand'
                  placeholder='https://...'
                />
              </div>
            </div>

            <DialogFooter className='pt-4 gap-4'>
              <Button
                variant='outline'
                onClick={() => setIsEditProfileOpen(false)}
                className='flex-1 h-12 rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-xs hover:bg-charcoal hover:text-white transition-all'>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                className='flex-1 h-12 bg-brand text-white rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none'>
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-cream'>
          <LoadingSpinner size='xl' className='h-screen' />
        </div>
      }>
      <AccountPageContent />
    </Suspense>
  );
}
