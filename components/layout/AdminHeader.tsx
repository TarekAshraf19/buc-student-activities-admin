"use client";

import {
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useLocale } from "@/hooks/useLocale";

import {
  logoutAdmin,
} from "@/services/admin-auth.service";

type AdminHeaderProps = {
  onOpenSidebar: () => void;
};

export default function AdminHeader({
  onOpenSidebar,
}: AdminHeaderProps) {
  const router =
    useRouter();

  const locale =
    useLocale();

  const t =
    useTranslations("Header");

  const dashboardT =
    useTranslations(
      "Dashboard"
    );

  const { user } =
    useAdminAuth();

  const handleLogout =
    async () => {
      await logoutAdmin();

      router.replace(
        `/${locale}/login`
      );
    };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={
              onOpenSidebar
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label={t("menu")}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="font-bold text-slate-900">
              {t("portal")}
            </p>

            <p className="truncate text-sm text-slate-500">
              {user?.email ??
                t("admin")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-auto sm:gap-2 sm:px-4"
            aria-label={
              dashboardT(
                "logout"
              )
            }
          >
            <LogOut className="h-4 w-4" />

            <span className="hidden text-sm font-semibold sm:inline">
              {dashboardT(
                "logout"
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}