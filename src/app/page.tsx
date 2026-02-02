import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { FeaturedRestaurants } from "@/components/landing/FeaturedRestaurants";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Browse the best restaurants and meals. Order now for a premium delivery experience.",
  openGraph: {
    title: "FoodHub | Discover & Order Delicious Meals",
    description:
      "The premium food delivery experience you've been waiting for.",
  },
};

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
