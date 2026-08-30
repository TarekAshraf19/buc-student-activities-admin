import {
  NextIntlClientProvider,
  hasLocale,
} from "next-intl";

import {
  getMessages,
} from "next-intl/server";

import {
  notFound,
} from "next/navigation";

import {
  routing,
} from "@/i18n/routing";

type LocaleLayoutProps = {
  children: React.ReactNode;

  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (
    !hasLocale(
      routing.locales,
      locale
    )
  ) {
    notFound();
  }

  const messages =
    await getMessages();

  return (
    <html
      lang={locale}
      dir={
        locale === "ar"
          ? "rtl"
          : "ltr"
      }
    >
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <NextIntlClientProvider
          messages={messages}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}