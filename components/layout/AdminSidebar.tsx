"use client";

import {
  Activity,
  BarChart3,
  Building2,
  ClipboardList,
  FlaskConical,
  House,
  MapPinned,
  Settings,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({
  open,
  onClose,
}: AdminSidebarProps) {
  const pathname =
    usePathname();

  const locale =
    useLocale();

  const t =
    useTranslations(
      "Navigation"
    );

  const items = [
    {
      label: t("overview"),
      href: `/${locale}/dashboard`,
      icon: House,
    },
    {
      label: t("colleges"),
      href: `/${locale}/dashboard/colleges`,
      icon: Building2,
    },
    {
      label: t("activities"),
      href: `/${locale}/dashboard/activities`,
      icon: Activity,
    },
    {
      label: t(
        "studentFamilies"
      ),
      href: `/${locale}/dashboard/student-families`,
      icon: Users,
    },
    {
      label: t(
        "localRegional"
      ),
      href: `/${locale}/dashboard/local-regional`,
      icon: MapPinned,
    },
    {
      label: t(
        "scientificSocieties"
      ),
      href: `/${locale}/dashboard/scientific-societies`,
      icon: FlaskConical,
    },
    {
      label: t(
        "collegePlans"
      ),
      href: `/${locale}/dashboard/college-plans`,
      icon: ClipboardList,
    },
    {
      label: t("reports"),
      href: `/${locale}/dashboard/reports`,
      icon: BarChart3,
    },
    {
      label: t(
        "administration"
      ),
      href: `/${locale}/dashboard/administration`,
      icon: Settings,
    },
  ];

  const isActive = (
    href: string
  ) => {
    if (
      href ===
      `/${locale}/dashboard`
    ) {
      return (
        pathname === href
      );
    }

    return pathname.startsWith(
      href
    );
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-full w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          locale === "ar"
            ? `right-0 ${
                open
                  ? "translate-x-0"
                  : "translate-x-full"
              }`
            : `left-0 ${
                open
                  ? "translate-x-0"
                  : "-translate-x-full"
              }`
        }`}
      >
<div className="border-b border-white/10 px-6 py-6">
  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
    BUC
  </p>

  <h2 className="mt-2 text-xl font-bold">
    {t("studentActivities")}
  </h2>

  <p className="mt-1 text-sm text-slate-400">
    {t("adminPortal")}
  </p>
</div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map(
            ({
              label,
              href,
              icon: Icon,
            }) => {
              const active =
                isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span>
                    {label}
                  </span>
                </Link>
              );
            }
          )}
        </nav>
      </aside>
    </>
  );
}