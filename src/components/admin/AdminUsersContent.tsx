"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Calendar,
  Store,
  User as UserIcon,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  providerProfile?: {
    restaurantName: string;
  };
}

export function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const json = await response.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setIsActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, isActive: !currentStatus } : u,
          ),
        );
      } else {
        toast.error(data.error || "Failed up update user status");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const restaurant =
        user.providerProfile?.restaurantName?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        restaurant.includes(query)
      );
    })
    .filter((user) => {
      const role = user.role.toLowerCase();
      if (roleFilter === "ALL") return true;
      if (roleFilter === "CUSTOMER")
        return role === "user" || role === "customer";
      return role === roleFilter.toLowerCase();
    });

  return (
    <div className='space-y-12'>
      {/* --- Header --- */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3 text-brand font-black uppercase tracking-[0.3em] text-[10px]'>
            <div className='size-2 bg-brand' /> Identity Control
          </div>
          <h1 className='text-5xl md:text-7xl font-serif font-black text-charcoal tracking-tighter italic leading-none'>
            The <span className='text-brand not-italic'>Roster.</span>
          </h1>
        </div>

        <div className='relative w-full md:w-96'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
          <Input
            placeholder='FILTER BY NAME, EMAIL, OR SHOP...'
            className='h-14 pl-12 pr-6 border-4 border-charcoal bg-white rounded-none font-black uppercase text-[10px] placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:ring-4'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- Filter Tabs --- */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='flex flex-wrap gap-2'>
          {["ALL", "ADMIN", "PROVIDER", "CUSTOMER"].map((role) => (
            <Button
              key={role}
              onClick={() => setRoleFilter(role)}
              variant='outline'
              className={`rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-[9px] h-10 px-6 transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 ${
                roleFilter === role
                  ? "bg-charcoal text-white"
                  : "bg-white text-charcoal hover:bg-brand hover:text-white"
              }`}>
              {role}
            </Button>
          ))}
        </div>

        <div className='text-[10px] font-black uppercase tracking-widest text-charcoal/40 bg-white border-2 border-charcoal px-4 py-2 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]'>
          {filteredUsers.length} Customers Found
        </div>
      </div>

      {isLoading ? (
        <div className='py-40'>
          <LoadingSpinner text='Consulting the archives...' size='lg' />
        </div>
      ) : (
        <div className='bg-white border-4 border-charcoal shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] overflow-x-auto'>
          <Table className='min-w-[800px]'>
            <TableHeader className='bg-charcoal'>
              <TableRow className='hover:bg-charcoal border-none'>
                <TableHead className='text-white font-black uppercase tracking-widest text-[10px] h-14'>
                  Profile
                </TableHead>
                <TableHead className='text-white font-black uppercase tracking-widest text-[10px] h-14'>
                  Role
                </TableHead>
                <TableHead className='text-white font-black uppercase tracking-widest text-[10px] h-14'>
                  Status
                </TableHead>
                <TableHead className='text-white font-black uppercase tracking-widest text-[10px] h-14'>
                  Account Details
                </TableHead>
                <TableHead className='text-white font-black uppercase tracking-widest text-[10px] h-14 text-right'>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className='hover:bg-cream/50 transition-colors border-b-2 border-charcoal/5'>
                    <TableCell className='py-6'>
                      <div className='flex items-center gap-4'>
                        <div className='size-12 bg-cream border-2 border-charcoal flex items-center justify-center rotate-3'>
                          {user.role === "provider" ? (
                            <Store className='size-6 text-brand' />
                          ) : (
                            <UserIcon className='size-6 text-charcoal' />
                          )}
                        </div>
                        <div>
                          <p className='font-black text-xs uppercase text-charcoal'>
                            {user.name}
                          </p>
                          <p className='text-[8px] font-bold text-gray-400 uppercase tracking-widest'>
                            {user.providerProfile?.restaurantName ||
                              "NO RESTAURANT"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-none border-2 border-charcoal uppercase text-[8px] font-black py-1 px-3 ${
                          user.role === "admin"
                            ? "bg-red-500 text-white"
                            : user.role === "provider"
                              ? "bg-purple-500 text-white"
                              : "bg-white text-charcoal"
                        }`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`size-3 border-2 border-charcoal rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500 animate-pulse"}`}
                        />
                        <span className='text-[8px] font-black uppercase tracking-widest'>
                          {user.isActive ? "Active" : "Suspended"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <p className='text-[10px] font-bold text-charcoal/60 uppercase flex items-center gap-2'>
                          <Mail className='size-3 text-brand' /> {user.email}
                        </p>
                        <p className='text-[10px] font-bold text-charcoal/60 uppercase flex items-center gap-2'>
                          <Calendar className='size-3 text-brand' /> Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='text-right px-8'>
                      <Button
                        disabled={
                          isActionLoading === user.id || user.role === "admin"
                        }
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`rounded-none border-2 border-charcoal font-black uppercase tracking-widest text-[8px] h-10 px-6 transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 ${
                          user.isActive
                            ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                            : "bg-green-500 text-white hover:bg-white hover:text-green-500"
                        }`}>
                        {isActionLoading === user.id ? (
                          <LoadingSpinner
                            size='sm'
                            text=''
                            brutalist={false}
                            className='p-0'
                          />
                        ) : user.isActive ? (
                          <>
                            <ShieldAlert className='size-3 mr-2' /> Suspend
                          </>
                        ) : (
                          <>
                            <ShieldCheck className='size-3 mr-2' /> Activate
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='py-20 text-center font-black uppercase tracking-widest text-charcoal/20'>
                    No entities matching your query
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
