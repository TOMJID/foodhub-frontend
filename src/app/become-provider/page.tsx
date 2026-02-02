import { Metadata } from "next";
import { BecomeProviderContent } from "@/components/become-provider/BecomeProviderContent";

export const metadata: Metadata = {
  title: "Become a Partner",
  description:
    "Join the city's premier network of chefs and restaurants. Grow your kitchen with FoodHub.",
};

export default function BecomeProviderPage() {
  return <BecomeProviderContent />;
}
