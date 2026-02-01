"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserWithExtras } from "./types";

interface AccountSidebarProps {
  user: UserWithExtras;
}

export function AccountSidebar({ user }: AccountSidebarProps) {
  return (
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
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
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
  );
}
