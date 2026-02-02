import { Metadata } from "next";
import { MealDetailsContent } from "@/components/meals/MealDetailsContent";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${BACKEND_URL}/api/meals/${id}`);
    const json = await response.json();

    if (json.success && json.data) {
      const meal = json.data;
      return {
        title: meal.name,
        description: `${meal.name} - ${meal.description || "Indulge in this chef-crafted masterpiece."} Order from ${meal.provider.restaurantName} on FoodHub.`,
        openGraph: {
          title: `${meal.name} | ${meal.provider.restaurantName}`,
          description:
            meal.description ||
            `Handcrafted ${meal.category.name} dish from ${meal.provider.restaurantName}.`,
          images: meal.imageUrl ? [{ url: meal.imageUrl }] : [],
        },
      };
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {
    title: "Meal Details",
    description: "View delicious meal details and order on FoodHub.",
  };
}

export default function MealDetailsPage() {
  return <MealDetailsContent />;
}
