import { Metadata } from "next";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order and get ready for a delicious meal.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
