import { Metadata } from "next";
import { AdminCategoriesContent } from "@/components/admin/AdminCategoriesContent";

export const metadata: Metadata = {
  title: "Manage Categories",
  description: "Define and manage culinary categories for the platform.",
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesContent />;
}
