import { Metadata } from "next";
import { RestaurantsContent } from "@/components/restaurants/RestaurantsContent";

export const metadata: Metadata = {
  title: "Restaurants",
  description:
    "Explore the best local kitchens and restaurants in the city. Find your favorite cuisine and order now.",
  openGraph: {
    title: "Local Kitchens & Restaurants | FoodHub",
    description:
      "Discover the city's finest culinary hubs. From hidden gems to city favorites.",
  },
};

export default function RestaurantsPage() {
  return <RestaurantsContent />;
}
