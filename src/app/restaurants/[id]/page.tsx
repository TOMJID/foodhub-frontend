import { Metadata } from "next";
import { RestaurantDetailsContent } from "@/components/restaurants/RestaurantDetailsContent";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${BACKEND_URL}/api/providers/${id}`);
    const json = await response.json();

    if (json.success && json.data) {
      const provider = json.data;
      return {
        title: provider.restaurantName,
        description: `Order from ${provider.restaurantName} on FoodHub. ${provider.cuisineType} cuisine located at ${provider.address}.`,
        openGraph: {
          title: `${provider.restaurantName} | FoodHub`,
          description: `Discover the best dishes from ${provider.restaurantName}.`,
          images: provider.coverImageUrl
            ? [{ url: provider.coverImageUrl }]
            : [],
        },
      };
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {
    title: "Restaurant Details",
    description: "View restaurant menu and details on FoodHub.",
  };
}

export default function ProviderDetailsPage() {
  return <RestaurantDetailsContent />;
}
