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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalMeals: number;
  totalOrders: number;
  deliveredRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const json = await response.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
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
      label: "TOTAL USERS",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      description: "Active platform participants",
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
      <div className='bg-charcoal text-white border-4 border-charcoal p-10 shadow-[16px_16px_0px_0px_rgba(255,87,34,1)] relative overflow-hidden group'>
        <div className='absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform'>
          <TrendingUp className='size-48' />
        </div>
        <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12'>
          <div className='space-y-4'>
            <p className='text-[10px] font-black uppercase tracking-[0.3em] text-brand'>
              Total Logged Revenue
            </p>
            <h2 className='text-6xl md:text-8xl font-serif font-black italic tracking-tighter'>
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
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className='rounded-none border-4 border-charcoal bg-white shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] transition-all'>
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
        ))}
      </div>
    </div>
  );
}
