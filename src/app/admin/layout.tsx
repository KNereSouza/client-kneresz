"use client";

import { useAuth } from "@/components/auth-provider";
import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-muted text-xs">&gt; _</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-muted text-sm">access denied</p>
      </div>
    );
  }

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
