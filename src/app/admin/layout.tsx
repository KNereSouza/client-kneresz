import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) notFound();

  return (
    <div className="min-h-dvh px-6 sm:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-sm font-bold mb-4">admin</h1>
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
