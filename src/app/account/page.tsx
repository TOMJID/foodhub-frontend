"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Loader2,
  Store,
  ChefHat,
  Utensils,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/my");
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
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className='min-h-screen bg-cream flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='size-16 text-brand animate-spin' />
          <p className='font-black uppercase tracking-widest text-charcoal/40'>
            Loading Account...
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as UserWithExtras;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className='min-h-screen bg-cream selection:bg-brand selection:text-white'>
      {/* --- Sticky Header --- */}
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
          {/* --- Profile Sidebar --- */}
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

          {/* --- Main Content --- */}
          <div className='lg:col-span-3'>
            <h1 className='text-5xl font-serif font-black text-charcoal tracking-tighter mb-8 italic'>
              Dashboard
            </h1>

            <Tabs defaultValue='profile' className='w-full'>
              <TabsList className='bg-charcoal p-1 rounded-none h-auto flex flex-wrap lg:flex-nowrap gap-1'>
                <TabsTrigger
                  value='profile'
                  className='rounded-none grow py-3 font-black uppercase tracking-widest text-[10px] text-white/50 data-[state=active]:bg-brand data-[state=active]:text-white hover:text-white transition-all'>
                  <User className='size-4 mr-2' />
                  Profile
                </TabsTrigger>
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
                                CHECKING...
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
                        <div className='py-20 flex flex-col items-center gap-4'>
                          <Loader2 className='size-12 text-brand animate-spin' />
                          <p className='font-black uppercase tracking-widest text-charcoal/20'>
                            Fetching your meals...
                          </p>
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
                                    ${order.totalAmount.toFixed(2)}
                                  </p>
                                </div>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='border-2 border-charcoal rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all'>
                                  View Details
                                </Button>
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
    </div>
  );
}
