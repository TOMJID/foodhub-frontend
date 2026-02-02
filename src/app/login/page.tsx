import { Metadata } from "next";
import { LoginContent } from "@/components/auth/LoginContent";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Log in to your FoodHub account to order delicious meals.",
};

export default function LoginPage() {
  return <LoginContent />;
}
