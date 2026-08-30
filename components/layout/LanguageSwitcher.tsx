"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const t = useTranslations("Language");

  const changeLanguage = () => {
    const nextLocale =
      locale === "ar"
        ? "en"
        : "ar";

    const segments =
      pathname.split("/");

    segments[1] =
      nextLocale;

    const newPath =
      segments.join("/");

    router.push(newPath);
  };

  return (
    <button
      type="button"
      onClick={changeLanguage}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <Languages className="h-4 w-4" />

      <span>
        {locale === "ar"
          ? t("english")
          : t("arabic")}
      </span>
    </button>
  );
}