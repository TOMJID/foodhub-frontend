import { Metadata } from "next";
import { RegisterContent } from "@/components/auth/RegisterContent";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join FoodHub and start your culinary journey today.",
};

export default function RegisterPage() {
  return <RegisterContent />;
}
