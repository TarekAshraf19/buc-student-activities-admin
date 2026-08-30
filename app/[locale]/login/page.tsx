"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  loginAdmin,
} from "@/services/admin-auth.service";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

export default function LoginPage() {
  const router = useRouter();

  const params =
    useParams<{
      locale: string;
    }>();

  const locale =
    params.locale;

  const t =
    useTranslations("Login");

  const {
    isAdmin,
    loading: authLoading,
  } = useAdminAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (
      !authLoading &&
      isAdmin
    ) {
      router.replace(
        `/${locale}/dashboard`
      );
    }
  }, [
    authLoading,
    isAdmin,
    locale,
    router,
  ]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginAdmin(
        email.trim(),
        password
      );

      router.replace(
        `/${locale}/dashboard`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : t("unauthorized")
      );
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = () => {
    const nextLocale =
      locale === "ar"
        ? "en"
        : "ar";

    router.push(
      `/${nextLocale}/login`
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_45%)]" />

      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={
            changeLanguage
          }
          className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {locale === "ar"
            ? "English"
            : "العربية"}
        </button>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
              {t("title")}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {t("subtitle")}
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                {t("email")}
              </label>

              <div className="relative">
                <Mail
                  className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${
                    locale === "ar"
                      ? "right-4"
                      : "left-4"
                  }`}
                />

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder={t(
                    "emailPlaceholder"
                  )}
                  dir="ltr"
                  className={`w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
                    locale === "ar"
                      ? "pr-12 pl-4 text-right"
                      : "pl-12 pr-4 text-left"
                  }`}
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                {t("password")}
              </label>

              <div className="relative">
                <LockKeyhole
                  className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${
                    locale === "ar"
                      ? "right-4"
                      : "left-4"
                  }`}
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder={t(
                    "passwordPlaceholder"
                  )}
                  className={`w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
                    locale === "ar"
                      ? "pr-12 pl-12"
                      : "pl-12 pr-12"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) =>
                        !value
                    )
                  }
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 ${
                    locale === "ar"
                      ? "left-4"
                      : "right-4"
                  }`}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? t("loggingIn")
                : t("login")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}