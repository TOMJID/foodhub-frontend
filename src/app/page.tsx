"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { FeaturedRestaurants } from "@/components/landing/FeaturedRestaurants";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <main className='grow pt-32'>
        <Hero />
        <Categories />
        <FeaturedRestaurants />
        <Footer />
      </main>
    </div>
  );
}
