"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  MapPin,
  Star,
  XCircle,
  ChefHat,
  ChevronRight,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserWithExtras, Order, ProviderProfile } from "./types";

interface OrdersTabProps {
  user: UserWithExtras;
  orders: Order[];
  isOrdersLoading: boolean;
  ordersType: "placed" | "received";
  setOrdersType: (type: "placed" | "received") => void;
  onReviewOrder: (order: Order) => void;
  onReviewMeal: (mealId: string, mealName: string) => void;
  onCancelOrder: (orderId: string) => void;
  providerProfile: ProviderProfile | null;
  placedOrders: Order[];
  receivedOrders: Order[];
}

export function OrdersTab({
  user,
  orders,
  isOrdersLoading,
  ordersType,
  setOrdersType,
  onReviewOrder,
  onReviewMeal,
  onCancelOrder,
  providerProfile,
  placedOrders,
  receivedOrders,
}: OrdersTabProps) {
  const currentOrders = ordersType === "placed" ? placedOrders : receivedOrders;

  return (
    <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
      <CardHeader className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <CardTitle className='font-serif font-black text-2xl uppercase tracking-tighter text-charcoal'>
            {user.role === "provider"
              ? ordersType === "placed"
                ? "Orders Placed"
                : "Orders Received"
              : "Order History"}
          </CardTitle>
          <CardDescription className='text-[10px] font-black uppercase tracking-[0.2em] text-brand'>
            {user.role === "provider"
              ? ordersType === "placed"
                ? "Your culinary journey as a customer"
                : "Orders placed by your customers"
              : "Your culinary journey"}
          </CardDescription>
        </div>

        {user.role === "provider" && (
          <div className='flex bg-charcoal p-1 rounded-none border-2 border-charcoal'>
            <button
              onClick={() => setOrdersType("placed")}
              className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${
                ordersType === "placed"
                  ? "bg-brand text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                  : "text-white/40 hover:text-white"
              }`}>
              My Orders
            </button>
            <button
              onClick={() => setOrdersType("received")}
              className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${
                ordersType === "received"
                  ? "bg-brand text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                  : "text-white/40 hover:text-white"
              }`}>
              Received
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isOrdersLoading ? (
          <div className='py-20 flex justify-center'>
            <LoadingSpinner size='lg' text='Fetching orders...' />
          </div>
        ) : currentOrders.length === 0 ? (
          <div className='py-20 text-center space-y-6 bg-cream/30 border-4 border-charcoal border-dashed'>
            <div className='size-20 bg-white border-4 border-charcoal shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] flex items-center justify-center mx-auto -rotate-3'>
              <Package className='size-10 text-brand' />
            </div>
            <div className='max-w-xs mx-auto space-y-2'>
              <p className='font-serif font-black text-2xl text-charcoal'>
                {ordersType === "received"
                  ? "Kitchen is Quiet"
                  : "No Orders Yet"}
              </p>
              <p className='text-xs font-bold text-gray-400 leading-relaxed uppercase'>
                {ordersType === "received"
                  ? "Your kitchen is waiting for its first ticket. Keep your menu fresh!"
                  : "Hungry? Start exploring our menu and place your first order."}
              </p>
            </div>
            <Button
              asChild
              className='bg-charcoal text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-none border-2 border-charcoal hover:bg-brand transition-all shadow-[4px_4px_0px_0px_rgba(255,87,34,1)] hover:shadow-none'>
              <Link href='/meals'>
                {ordersType === "received" ? "Check My Menu" : "Browse Meals"}
              </Link>
            </Button>
          </div>
        ) : (
          <div className='space-y-6'>
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className='group bg-white border-4 border-charcoal shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden'>
                <div className='p-6'>
                  <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6'>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-charcoal text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]'>
                          #{order.id.slice(-6).toUpperCase()}
                        </div>
                        <Badge
                          className={`rounded-none border-2 border-charcoal font-black uppercase text-[8px] px-3 py-0.5 ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700 border-green-700 shadow-[2px_2px_0px_0px_rgba(21,128,61,1)]"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-700 border-red-700 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]"
                                : order.status === "placed"
                                  ? "bg-blue-100 text-blue-700 border-blue-700 shadow-[2px_2px_0px_0px_rgba(29,78,216,1)]"
                                  : "bg-brand/10 text-brand border-brand shadow-[2px_2px_0px_0px_rgba(255,87,34,1)]"
                          }`}>
                          {order.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <h3 className='text-xl font-serif font-black text-charcoal flex items-center gap-2'>
                        {ordersType === "received" ? (
                          <>
                            <span className='text-[10px] font-bold text-gray-400 uppercase italic'>
                              From:
                            </span>{" "}
                            {order.customer?.name || "Customer"}
                          </>
                        ) : (
                          <>
                            <span className='text-[10px] font-bold text-gray-400 uppercase italic'>
                              At:
                            </span>{" "}
                            {order.provider?.restaurantName || "Restaurant"}
                          </>
                        )}
                      </h3>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      {ordersType === "placed" &&
                        order.status === "delivered" &&
                        (order.customerId === user.id ||
                          order.customer?.email === user.email) && (
                          <Button
                            onClick={() => onReviewOrder(order)}
                            size='sm'
                            className='bg-brand text-white border-2 border-charcoal rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-brand transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none'>
                            <Star className='size-3 mr-1.5' />
                            Review Items
                          </Button>
                        )}
                      {ordersType === "placed" && order.status === "placed" && (
                        <Button
                          onClick={() => onCancelOrder(order.id)}
                          variant='outline'
                          size='sm'
                          className='text-red-500 border-2 border-red-500 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(185,28,28,1)] hover:shadow-none'>
                          <XCircle className='size-3 mr-1.5' />
                          Cancel Order
                        </Button>
                      )}
                      {ordersType === "received" && (
                        <Button
                          asChild
                          variant='outline'
                          size='sm'
                          className='border-2 border-charcoal rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none'>
                          <Link href='/restaurant-dashboard'>
                            <ChefHat className='size-3 mr-1.5' />
                            Manage Status
                          </Link>
                        </Button>
                      )}
                      <div className='text-2xl font-serif font-black text-charcoal'>
                        ${Number(order.totalAmount).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b-2 border-charcoal/5'>
                    <div className='flex items-start gap-3'>
                      <Clock className='size-4 text-brand mt-1 shrink-0' />
                      <div className='space-y-1'>
                        <p className='text-[10px] font-black uppercase text-gray-400'>
                          Placed On
                        </p>
                        <p className='text-xs font-bold'>
                          {new Date(order.createdAt).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <MapPin className='size-4 text-brand mt-1 shrink-0' />
                      <div className='space-y-1'>
                        <p className='text-[10px] font-black uppercase text-gray-400'>
                          Delivery Address
                        </p>
                        <p className='text-xs font-bold line-clamp-1'>
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='pt-4'>
                    <p className='text-[10px] font-black uppercase text-gray-400 mb-3'>
                      Order Items ({order.items.length})
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {order.items.map((item) => (
                        <Badge
                          key={item.id}
                          variant='outline'
                          className='rounded-none border-2 border-charcoal bg-cream/50 text-charcoal text-[8px] font-bold px-3 py-1.5'>
                          {item.quantity}x {item.meal?.name || "Meal"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
