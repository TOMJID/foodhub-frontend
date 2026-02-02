import { Metadata } from "next";
import { RestaurantDashboardContent } from "@/components/restaurant-dashboard/RestaurantDashboardContent";

export const metadata: Metadata = {
  title: "Kitchen Console",
  description: "Manage your menu and active orders.",
};

export default function RestaurantDashboardPage() {
  return <RestaurantDashboardContent />;
}
