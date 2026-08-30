"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useTranslations,
} from "next-intl";

import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import {
  useLocale,
} from "@/hooks/useLocale";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router =
    useRouter();

  const locale =
    useLocale();

  const t =
    useTranslations(
      "Dashboard"
    );

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const {
    user,
    isAdmin,
    loading,
  } = useAdminAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (
      !user ||
      !isAdmin
    ) {
      router.replace(
        `/${locale}/login`
      );
    }
  }, [
    user,
    isAdmin,
    loading,
    locale,
    router,
  ]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-400">
            {t("loading")}
          </p>
        </div>
      </main>
    );
  }

  if (
    !user ||
    !isAdmin
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(
            false
          )
        }
      />

      <div
        className={
          locale === "ar"
            ? "lg:pr-72"
            : "lg:pl-72"
        }
      >
        <AdminHeader
          onOpenSidebar={() =>
            setSidebarOpen(
              true
            )
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}