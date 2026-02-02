"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Pizza,
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalMeals: number;
  totalOrders: number;
  deliveredRevenue: number;
}

interface Activity {
  id: string;
  type: "ORDER" | "USER" | "PROVIDER";
  title: string;
  subtitle: string;
  timestamp: string;
  status?: string;
}

export function AdminDashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/orders/my", { credentials: "include" }),
        ]);

        const statsJson = await statsRes.json();
        const ordersJson = await ordersRes.json();

        if (statsJson.success) {
          setStats(statsJson.data);
        }

        if (ordersJson.success) {
          // Transform recent orders into activity feed
          const recentOrders = ordersJson.data
            .slice(0, 5)
            .map(
              (order: {
                id: string;
                customer?: { name: string };
                totalAmount: number;
                items?: { id: string }[];
                status: string;
                createdAt: string;
              }) => ({
                id: order.id,
                type: "ORDER",
                title: `New Order from ${order.customer?.name || "Guest"}`,
                subtitle: `$${Number(order.totalAmount).toFixed(2)} • ${order.items?.length || 0} items`,
                timestamp: order.createdAt,
                status: order.status,
              }),
            );
          setActivities(recentOrders);
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className='py-40'>
        <LoadingSpinner text='Compiling Platform Data...' size='lg' />
      </div>
    );
  }

  const statCards = [
    {
      label: "TOTAL CUSTOMERS",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      description: "Active platform customers",
    },
    {
      label: "RESTAURANTS",
      value: stats?.totalProviders || 0,
      icon: Store,
      color: "bg-purple-500",
      description: "Validated food providers",
    },
    {
      label: "DISHES LOGGED",
      value: stats?.totalMeals || 0,
      icon: Pizza,
      color: "bg-yellow-500",
      description: "Available menu items",
    },
    {
      label: "ALL ORDERS",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-green-500",
      description: "Lifetime transaction count",
    },
  ];

  return (
    <div className='space-y-12'>
      {/* --- Header --- */}
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <div className='size-2 bg-brand animate-pulse' />
          <span className='text-brand font-black uppercase tracking-[0.3em] text-[10px]'>
            Central Hub
          </span>
        </div>
        <h1 className='text-5xl md:text-7xl font-serif font-black text-charcoal tracking-tighter italic leading-none'>
          Platform <span className='text-brand not-italic'>Pulse.</span>
        </h1>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest max-w-xl'>
          Real-time metrics for the entire FoodHub ecosystem. Manage growth,
          oversight, and culinary excellence from one screen.
        </p>
      </div>

      {/* --- Revenue Banner --- */}
      <div className='bg-charcoal text-white border-4 border-charcoal p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] sm:shadow-[16px_16px_0px_0px_rgba(255,87,34,1)] relative overflow-hidden group'>
        <div className='absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform hidden sm:block'>
          <TrendingUp className='size-48' />
        </div>
        <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12'>
          <div className='space-y-4'>
            <p className='text-[10px] font-black uppercase tracking-[0.3em] text-brand'>
              Total Logged Revenue
            </p>
            <h2 className='text-4xl sm:text-6xl md:text-8xl font-serif font-black italic tracking-tighter break-all'>
              $
              {Number(stats?.deliveredRevenue || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
            <div className='flex items-center gap-4 bg-white/10 w-fit px-4 py-2 border border-white/20'>
              <Activity className='size-4 text-brand' />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Orders in &quot;Delivered&quot; state
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Stat Cards --- */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}>
            <Card className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] transition-all h-full'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <div
                  className={`${stat.color} p-3 border-2 border-charcoal text-white rotate-3`}>
                  <stat.icon className='size-5' />
                </div>
                <ArrowUpRight className='size-4 text-charcoal/20' />
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-serif font-black tracking-tighter text-charcoal mb-1 italic'>
                  {stat.value.toLocaleString()}
                </div>
                <p className='text-[10px] font-black uppercase tracking-widest text-charcoal/40 mb-2'>
                  {stat.label}
                </p>
                <p className='text-[8px] font-bold text-gray-300 uppercase tracking-widest'>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-12'>
        {/* --- Activity Feed --- */}
        <Card className='rounded-none border-4 border-charcoal bg-white shadow-[12px_12px_0px_0px_rgba(10,10,10,1)]'>
          <CardHeader className='border-b-4 border-charcoal bg-cream/50'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Activity className='size-5 text-brand' />
                <CardTitle className='font-serif font-black text-2xl uppercase italic tracking-tighter'>
                  Live Stream
                </CardTitle>
              </div>
              <Button
                asChild
                variant='link'
                className='text-[10px] font-black uppercase tracking-widest text-brand p-0 hover:no-underline'>
                <Link href='/admin/orders'>View All Monitor</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='p-0 divide-y-4 divide-charcoal/5'>
            {activities.length > 0 ? (
              activities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className='p-6 flex items-center justify-between group hover:bg-cream/30 transition-colors'>
                  <div className='flex items-center gap-4'>
                    <div className='size-12 bg-charcoal text-brand border-2 border-charcoal flex items-center justify-center shrink-0 rotate-2 group-hover:rotate-0 transition-transform shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]'>
                      <ShoppingBag className='size-5' />
                    </div>
                    <div>
                      <p className='font-black text-xs uppercase text-charcoal'>
                        {activity.title}
                      </p>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    <Badge className='rounded-none border-2 border-charcoal bg-white text-charcoal text-[8px] font-black uppercase py-0.5 px-2'>
                      {activity.status}
                    </Badge>
                    <span className='text-[8px] font-black text-gray-300 uppercase'>
                      {new Date(activity.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className='p-20 text-center font-black uppercase tracking-widest text-charcoal/20 text-xs italic'>
                No recent activity detected on the wire.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
