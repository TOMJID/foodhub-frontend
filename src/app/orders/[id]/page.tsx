import { Metadata } from "next";
import { OrderDetailsContent } from "@/components/orders/OrderDetailsContent";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${BACKEND_URL}/api/orders/${id}`);
    const json = await response.json();

    if (json.success && json.data) {
      const order = json.data;
      return {
        title: `Order #${order.id.slice(-8).toUpperCase()}`,
        description: `View details for order #${order.id} from ${order.provider.restaurantName}.`,
      };
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {
    title: "Order Details",
    description: "View your order details on FoodHub.",
  };
}

export default function OrderDetailsPage() {
  return <OrderDetailsContent />;
}
