"use client";

import { useLocaleContext } from "@/lib/locale-provider";

export function useAppLocale() {
  const { locale, setLocale, isRtl } = useLocaleContext();
  return { locale, setLocale, isRtl };
}

export function useFormatters() {
  const { locale } = useLocaleContext();
  return {
    currency(amount: number, currency: string = "USD") {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(amount);
    },
    number(n: number) {
      return new Intl.NumberFormat(locale).format(n);
    },
    date(d: Date, opts?: Intl.DateTimeFormatOptions) {
      return new Intl.DateTimeFormat(
        locale,
        opts ?? { year: "numeric", month: "short", day: "numeric" }
      ).format(d);
    },
    time(d: Date) {
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    },
  };
}
