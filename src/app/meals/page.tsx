import { Metadata } from "next";
import { MealsContent } from "@/components/meals/MealsContent";

export const metadata: Metadata = {
  title: "Browse Meals",
  description:
    "Discover a curated collection of culinary masterpieces from top-rated kitchens. Order your favorite meal now.",
  openGraph: {
    title: "Chef's Selection | FoodHub Meals",
    description:
      "Handcrafted meals from the city's finest kitchens. Find your craving today.",
  },
};

export default function MealsPage() {
  return <MealsContent />;
}
