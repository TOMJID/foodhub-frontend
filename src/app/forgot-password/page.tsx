import { Metadata } from "next";
import { ForgotPasswordContent } from "@/components/auth/ForgotPasswordContent";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your FoodHub account access.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
