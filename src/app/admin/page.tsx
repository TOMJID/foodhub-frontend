import { Metadata } from "next";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Platform-wide metrics and management.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
