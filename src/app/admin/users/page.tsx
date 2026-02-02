import { Metadata } from "next";
import { AdminUsersContent } from "@/components/admin/AdminUsersContent";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage user accounts and roles on the platform.",
};

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
