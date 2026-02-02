import { Metadata } from "next";
import { AdminUsersContent } from "@/components/admin/AdminUsersContent";

export const metadata: Metadata = {
  title: "Customer Management",
  description: "Manage customer accounts and roles on the platform.",
};

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
