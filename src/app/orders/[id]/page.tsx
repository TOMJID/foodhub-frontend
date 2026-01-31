"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  ChevronLeft,
  Package,
  MapPin,
  Clock,
  Store,
  Receipt,
  Truck,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtTime: number;
  meal: {
    name: string;
    imageUrl?: string | null;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
  provider: {
    restaurantName: string;
    address: string;
  };
  items: OrderItem[];
}

const getStatusDetails = (status: string) => {
  switch (status.toLowerCase()) {
    case "placed":
      return {
        color: "bg-blue-500",
        label: "Ticket Created",
        icon: <Package className='size-4' />,
        desc: "Kitchen has received your ticket and will start soon.",
      };
    case "preparing":
      return {
        color: "bg-orange-500",
        label: "Chef is Cooking",
        icon: <Clock className='size-4' />,
        desc: "Ingredients are meeting the fire. Freshness incoming.",
      };
    case "ready":
      return {
        color: "bg-green-500",
        label: "Ready for Pickup",
        icon: <CheckCircle2 className='size-4' />,
        desc: "Your meal is hot and packed for travel.",
      };
    case "delivered":
      return {
        color: "bg-charcoal",
        label: "Order Delivered",
        icon: <Truck className='size-4' />,
        desc: "Feast has reached its destination. Enjoy!",
      };
    case "cancelled":
      return {
        color: "bg-red-500",
        label: "Order Cancelled",
        icon: <AlertCircle className='size-4' />,
        desc: "This ticket was voided.",
      };
    default:
      return {
        color: "bg-gray-500",
        label: status,
        icon: <Package className='size-4' />,
        desc: "Processing...",
      };
  }
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push(`/login?redirect=/orders/${id}`);
    }
  }, [session, isAuthLoading, id, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && session) {
      fetchOrder();
    }
  }, [id, session]);

  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const confirmCancelOrder = async () => {
    if (!order || order.status !== "placed") return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/cancel/${order.id}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Order cancelled successfully");
        setOrder({ ...order, status: "cancelled" });
        setShowCancelDialog(false);
      } else {
        toast.error(data.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className='min-h-screen bg-cream'>
        <LoadingSpinner
          text='Consulting the radar...'
          size='xl'
          className='h-screen'
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center space-y-6'>
        <div className='size-24 bg-white border-4 border-charcoal flex items-center justify-center rotate-6 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
          <AlertCircle className='size-12 text-red-500' />
        </div>
        <div>
          <h1 className='text-3xl font-serif font-black text-charcoal uppercase'>
            Ticket Not Found
          </h1>
          <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mt-2'>
            We couldn&apos;t track down this receipt.
          </p>
        </div>
        <Button
          asChild
          className='bg-brand text-white border-2 border-charcoal rounded-none px-8 py-6 font-black uppercase tracking-widest hover:bg-black transition-all shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
          <Link href='/account?tab=orders'>Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusDetails(order.status);

  return (
    <div className='min-h-screen bg-cream selection:bg-brand selection:text-white pb-20'>
      <header className='bg-white border-b-4 border-charcoal sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <Link
            href='/account?tab=orders'
            className='group flex items-center gap-2'>
            <div className='size-10 border-2 border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all'>
              <ChevronLeft className='size-5' />
            </div>
            <span className='text-xs font-black uppercase tracking-widest'>
              Orders
            </span>
          </Link>
          <span className='font-serif font-black text-2xl tracking-tighter uppercase italic'>
            Receipt{" "}
            <span className='text-brand not-italic'>
              #{order.id.slice(-8).toUpperCase()}
            </span>
          </span>
          <div className='size-10' />
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          {/* --- Left Column: Status & Address --- */}
          <div className='lg:col-span-12'>
            <div className='bg-charcoal text-white border-4 border-charcoal p-8 shadow-[12px_12px_0px_0px_rgba(255,87,34,1)] mb-12 flex flex-col md:flex-row items-center justify-between gap-8'>
              <div className='flex items-center gap-6'>
                <div
                  className={`size-20 ${statusInfo.color} border-4 border-white flex items-center justify-center rotate-3 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]`}>
                  {/* Size and icon scaling */}
                  {statusInfo.icon && (
                    <div className='scale-[2.5]'>{statusInfo.icon}</div>
                  )}
                </div>
                <div>
                  <p className='text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-1'>
                    Current Status
                  </p>
                  <h2 className='text-4xl font-serif font-black tracking-tighter uppercase italic italic-none'>
                    {statusInfo.label}
                  </h2>
                  <p className='text-xs font-bold text-white/60 mt-2 uppercase tracking-widest'>
                    {statusInfo.desc}
                  </p>
                </div>
              </div>
              <div className='text-center md:text-right hidden md:block'>
                <p className='text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1'>
                  Estimated Delivery
                </p>
                <p className='text-2xl font-serif font-black italic'>
                  25-30 MINS
                </p>
              </div>
            </div>
          </div>

          <div className='lg:col-span-7 space-y-12'>
            {/* --- Order Items --- */}
            <section className='space-y-6'>
              <div className='flex items-center gap-3'>
                <Receipt className='size-6 text-brand' />
                <h3 className='text-2xl font-serif font-black text-charcoal uppercase tracking-tight'>
                  Order Details
                </h3>
              </div>
              <Card className='rounded-none border-4 border-charcoal bg-white shadow-[12px_12px_0px_0px_rgba(10,10,10,1)]'>
                <CardContent className='p-0'>
                  <div className='divide-y-4 divide-charcoal/5'>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className='p-6 flex items-center gap-6'>
                        <div className='relative size-20 border-2 border-charcoal shrink-0 bg-cream group'>
                          {item.meal.imageUrl ? (
                            <Image
                              src={item.meal.imageUrl}
                              alt={item.meal.name}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <div className='size-full flex items-center justify-center opacity-10'>
                              <Package className='size-8' />
                            </div>
                          )}
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-serif font-black text-xl text-charcoal uppercase leading-none mb-2'>
                            {item.meal.name}
                          </h4>
                          <div className='flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest'>
                            <span>
                              ${Number(item.priceAtTime).toFixed(2)} Each
                            </span>
                            <span className='size-1.5 bg-brand' />
                            <span className='text-charcoal font-black'>
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='text-lg font-black text-charcoal'>
                            $
                            {(Number(item.priceAtTime) * item.quantity).toFixed(
                              2,
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* --- Info Blocks --- */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]'>
                <CardHeader className='pb-2'>
                  <CardDescription className='text-[10px] font-black uppercase text-brand tracking-widest'>
                    Customer
                  </CardDescription>
                  <CardTitle className='font-serif font-black text-xl uppercase italic'>
                    {order.customer.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-2'>
                  <div className='flex items-center gap-2 text-xs font-bold text-gray-500 uppercase'>
                    <MapPin className='size-4 text-brand shrink-0' />
                    <span className='leading-tight'>
                      {order.deliveryAddress}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
                <CardHeader className='pb-2'>
                  <CardDescription className='text-[10px] font-black uppercase text-brand tracking-widest'>
                    Kitchen
                  </CardDescription>
                  <CardTitle className='font-serif font-black text-xl uppercase italic'>
                    {order.provider.restaurantName}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-2'>
                  <div className='flex items-center gap-2 text-xs font-bold text-gray-500 uppercase'>
                    <Store className='size-4 text-brand shrink-0' />
                    <span className='leading-tight'>
                      {order.provider.address}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* --- Right Column: Totals --- */}
          <div className='lg:col-span-5'>
            <div className='sticky top-32 space-y-8'>
              <Card className='rounded-none border-8 border-brand bg-white shadow-[16px_16px_0px_0px_rgba(10,10,10,1)]'>
                <CardHeader className='bg-brand text-white text-center py-10'>
                  <p className='text-[10px] font-black uppercase tracking-[0.4em] mb-2'>
                    Order Placed On
                  </p>
                  <p className='text-xl font-serif font-black'>
                    {new Date(order.createdAt)
                      .toLocaleString([], {
                        dateStyle: "long",
                        timeStyle: "short",
                      })
                      .toUpperCase()}
                  </p>
                </CardHeader>
                <CardContent className='p-8 space-y-8'>
                  <div className='space-y-4 font-black uppercase tracking-widest text-[10px]'>
                    <div className='flex justify-between items-center text-charcoal/40'>
                      <span>Subtotal</span>
                      <span className='text-charcoal'>
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center text-charcoal/40 font-black'>
                      <span>Delivery Fee</span>
                      <span className='text-brand'>FREE</span>
                    </div>
                    <Separator className='bg-charcoal h-1' />
                    <div className='flex justify-between items-baseline pt-4'>
                      <span className='font-serif text-3xl italic text-charcoal'>
                        Total Paid
                      </span>
                      <span className='font-serif text-5xl italic text-brand tracking-tighter'>
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='flex flex-col gap-4'>
                <Button
                  asChild
                  className='w-full h-16 bg-charcoal text-white rounded-none border-4 border-charcoal font-black uppercase tracking-widest text-sm hover:bg-brand transition-all shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] active:shadow-none'>
                  <Link href='/meals'>Reorder Again</Link>
                </Button>

                {/* Cancel Order Button - only shown when status is "placed" */}
                {order.status === "placed" && (
                  <Button
                    onClick={() => setShowCancelDialog(true)}
                    variant='outline'
                    className='w-full h-14 bg-white text-red-600 rounded-none border-4 border-red-500 font-black uppercase tracking-widest text-sm hover:bg-red-500 hover:text-white transition-all'>
                    <XCircle className='size-4 mr-2' />
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
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
                onClick={() => setShowCancelDialog(false)}
                className='flex-1 h-12 rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-xs hover:bg-charcoal hover:text-white transition-all'>
                Keep Order
              </Button>
              <Button
                onClick={confirmCancelOrder}
                disabled={isCancelling}
                className='flex-1 h-12 bg-red-500 text-white rounded-none border-2 border-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all'>
                {isCancelling ? (
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
    </div>
  );
}
