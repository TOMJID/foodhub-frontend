"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  ExternalLink,
  ChefHat,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
  customer?: { name: string };
  provider?: { restaurantName: string };
  items: {
    meal: { name: string };
    quantity: number;
  }[];
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "placed":
      return { color: "bg-blue-500", text: "Ticket Logged", icon: Package };
    case "preparing":
      return { color: "bg-orange-500", text: "Kitchen Busy", icon: ChefHat };
    case "ready":
      return { color: "bg-green-500", text: "Hot & Ready", icon: CheckCircle2 };
    case "delivered":
      return { color: "bg-charcoal", text: "Handed Over", icon: Truck };
    case "cancelled":
      return { color: "bg-red-500", text: "Voided", icon: AlertCircle };
    default:
      return { color: "bg-gray-400", text: status, icon: Clock };
  }
};

export function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

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
      console.error("Failed to fetch all orders:", error);
      toast.error("Failed to sync order stream.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer?.name?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ) ||
        (order.provider?.restaurantName?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ),
    )
    .filter((order) =>
      filterStatus === "ALL"
        ? true
        : order.status.toLowerCase() === filterStatus.toLowerCase(),
    );

  return (
    <div className='space-y-12'>
      {/* --- Header --- */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3 text-brand font-black uppercase tracking-[0.3em] text-[10px]'>
            <div className='size-2 bg-brand' /> Global Monitor
          </div>
          <h1 className='text-5xl md:text-7xl font-serif font-black text-charcoal tracking-tighter italic leading-none'>
            Order <span className='text-brand not-italic'>Stream.</span>
          </h1>
        </div>

        <div className='relative w-full md:w-96'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
          <Input
            placeholder='FILTER BY TICKET ID, CUSTOMER, OR SHOP...'
            className='h-14 pl-12 pr-6 border-4 border-charcoal bg-white rounded-none font-black uppercase text-[10px] placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:ring-4'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- Filter Tabs --- */}
      <div className='flex flex-wrap gap-2'>
        {["ALL", "PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              variant='outline'
              className={`rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-[9px] h-10 px-6 transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 ${
                filterStatus === status
                  ? "bg-charcoal text-white"
                  : "bg-white text-charcoal hover:bg-brand hover:text-white"
              }`}>
              {status}
            </Button>
          ),
        )}
      </div>

      {isLoading ? (
        <div className='py-40'>
          <LoadingSpinner text='Syncing with the kitchen...' size='lg' />
        </div>
      ) : (
        <div className='bg-white border-4 border-charcoal shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] overflow-x-auto'>
          <Table className='min-w-[800px]'>
            <TableHeader className='bg-charcoal text-white font-black'>
              <TableRow className='hover:bg-charcoal border-none'>
                <TableHead className='text-white uppercase tracking-widest text-[8px] h-14'>
                  Ticket
                </TableHead>
                <TableHead className='text-white uppercase tracking-widest text-[8px] h-14'>
                  Ecosystem Link
                </TableHead>
                <TableHead className='text-white uppercase tracking-widest text-[8px] h-14'>
                  Status
                </TableHead>
                <TableHead className='text-white uppercase tracking-widest text-[8px] h-14'>
                  Economics
                </TableHead>
                <TableHead className='text-white uppercase tracking-widest text-[8px] h-14 text-right'>
                  Audit
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const status = getStatusStyles(order.status);
                  const Icon = status.icon;
                  return (
                    <TableRow
                      key={order.id}
                      className='hover:bg-cream/50 transition-colors border-b-2 border-charcoal/5'>
                      <TableCell className='py-6'>
                        <div>
                          <p className='text-[8px] font-black text-brand uppercase tracking-widest mb-1 italic'>
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className='text-[8px] font-bold text-gray-400 uppercase tracking-widest'>
                            PLACED{" "}
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <div className='size-6 bg-cream border border-charcoal flex items-center justify-center'>
                              <ChefHat className='size-3 text-brand' />
                            </div>
                            <span className='font-black text-[10px] uppercase text-charcoal truncate max-w-[120px]'>
                              {order.provider?.restaurantName ||
                                "Unknown Provider"}
                            </span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='size-6 bg-cream border border-charcoal flex items-center justify-center scale-90 opacity-50'>
                              <Receipt className='size-3 text-charcoal' />
                            </div>
                            <span className='font-bold text-[8px] uppercase text-gray-400 truncate max-w-[120px]'>
                              {order.customer?.name || "Unknown Customer"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 border-charcoal text-white rounded-none ${status.color}`}>
                          <Icon className='size-3' />
                          <span className='text-[8px] font-black uppercase tracking-widest'>
                            {status.text}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='text-sm font-black text-charcoal tracking-tighter'>
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                          <span className='text-[8px] font-bold text-gray-400 uppercase tracking-widest'>
                            {(order.items || []).reduce(
                              (acc, i) => acc + i.quantity,
                              0,
                            )}{" "}
                            Items
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right px-8'>
                        <Button
                          asChild
                          variant='outline'
                          className='rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-[8px] h-10 px-6 hover:bg-charcoal hover:text-white transition-all shadow-[4px_4px_1px_0px_rgba(10,10,10,1)] hover:shadow-none active:translate-x-1 active:translate-y-1'>
                          <Link href={`/orders/${order.id}`}>
                            Details <ExternalLink className='size-3 ml-2' />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='py-20 text-center font-black uppercase tracking-widest text-charcoal/20 leading-loose'>
                    The commerce stream is empty or matching nothing
                    <br />
                    <ShoppingBag className='size-6 mx-auto mt-4 opacity-5' />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
