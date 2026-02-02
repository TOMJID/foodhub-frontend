import { Metadata } from "next";
import { AdminOrdersContent } from "@/components/admin/AdminOrdersContent";

export const metadata: Metadata = {
  title: "All Orders",
  description: "Monitor and manage all orders placed on the platform.",
};

export default function AdminOrdersPage() {
  return <AdminOrdersContent />;
}
