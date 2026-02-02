"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  ArrowLeft,
  Pizza,
  Hamburger,
  Coffee,
  IceCreamCone,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function NotFound() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const floatingVariants: Variants = {
    animate: (i: number) => ({
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-cream p-4 text-center space-y-8 overflow-hidden relative'>
      {/* Decorative Floating Elements */}
      <motion.div
        custom={0}
        variants={floatingVariants}
        animate='animate'
        className='absolute top-[15%] left-[10%] text-brand/20 hidden md:block'>
        <Pizza size={80} />
      </motion.div>
      <motion.div
        custom={1}
        variants={floatingVariants}
        animate='animate'
        className='absolute bottom-[20%] left-[15%] text-charcoal/10 hidden md:block'>
        <Hamburger size={60} />
      </motion.div>
      <motion.div
        custom={2}
        variants={floatingVariants}
        animate='animate'
        className='absolute top-[20%] right-[10%] text-brand/20 hidden md:block'>
        <Coffee size={70} />
      </motion.div>
      <motion.div
        custom={3}
        variants={floatingVariants}
        animate='animate'
        className='absolute bottom-[15%] right-[15%] text-charcoal/10 hidden md:block'>
        <IceCreamCone size={90} />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial='initial'
        animate='animate'
        className='flex flex-col items-center space-y-8 z-10'>
        {/* 404 Display */}
        <motion.div variants={itemVariants} className='relative'>
          <h1 className='text-[150px] md:text-[220px] font-black leading-none text-charcoal select-none tracking-tighter'>
            4
            <motion.span
              animate={{
                y: [0, -30, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className='text-brand inline-block'>
              0
            </motion.span>
            4
          </h1>
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 100,
              delay: 0.5,
            }}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-charcoal p-4 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
            <UtensilsCrossed className='size-16 md:size-24 text-charcoal' />
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='space-y-4 max-w-md mx-auto'>
          <h2 className='text-3xl md:text-5xl font-black uppercase text-charcoal tracking-tighter italic'>
            Kitchen Nightmare!
          </h2>
          <p className='text-charcoal/60 font-bold uppercase tracking-widest text-xs md:text-sm px-4'>
            We couldn&apos;t find the page you ordered. It might have been eaten
            or never existed in our menu.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='flex flex-col sm:flex-row gap-4'>
          <Button
            asChild
            className='bg-charcoal text-white rounded-none border-2 border-charcoal font-black uppercase tracking-widest h-14 px-10 hover:bg-brand hover:border-brand transition-all shadow-[6px_6px_0px_0px_#ea580c] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'>
            <Link href='/'>
              <ArrowLeft className='mr-2 size-5' /> Return Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer decoration */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 1 }}
        className='fixed bottom-0 left-0 w-full h-3 bg-charcoal flex'>
        <div className='h-full w-1/4 bg-brand' />
        <div className='h-full w-1/4 bg-cream' />
        <div className='h-full w-1/4 bg-charcoal' />
        <div className='h-full w-1/4 bg-brand' />
      </motion.div>
    </div>
  );
}
