"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { AbstractIntlMessages } from "next-intl";
import {
	NextIntlClientProvider,
	useTranslations as useNextIntlTranslations,
} from "next-intl";
import {
	Locale,
	defaultLocale,
	getMessages,
	isRtlLocale,
	locales,
} from "./i18n";
import Image from "next/image";

type LocaleContextType = {
	locale: Locale;
	setLocale: (l: Locale) => void;
	isRtl: boolean;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>(defaultLocale);
	const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);

	// Bootstrap from localStorage or navigator
	useEffect(() => {
		const saved =
			typeof window !== "undefined"
				? localStorage.getItem("hyperbetz-locale")
				: null;
		if (saved && locales.includes(saved as Locale)) {
			setLocaleState(saved as Locale);
		} else if (!saved && typeof navigator !== "undefined") {
			const nav = navigator.language?.slice(0, 2) as Locale;
			if (locales.includes(nav)) setLocaleState(nav);
		}
	}, []);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const m = await getMessages(locale);
			if (!mounted) return;
			setMessages(m as AbstractIntlMessages);
			if (typeof document !== "undefined") {
				document.documentElement.lang = locale;
				document.documentElement.dir = isRtlLocale(locale)
					? "rtl"
					: "ltr";
			}
		})();
		return () => {
			mounted = false;
		};
	}, [locale]);

	const setLocale = (l: Locale) => {
		setLocaleState(l);
		if (typeof window !== "undefined")
			localStorage.setItem("hyperbetz-locale", l);
	};

	const ctx: LocaleContextType = useMemo(
		() => ({ locale, setLocale, isRtl: isRtlLocale(locale) }),
		[locale]
	);

	if (!messages) {
		return (
			<div className="min-h-screen bg-background flex flex-col items-center justify-center">
				{/* App Logo */}
				<div className="mb-6 animate-pulse">
					<Image
						priority
						width={800}
						height={800}
						src="/assets/site/Hyperbetz-logo.png"
						alt="Hyperbetz Logo"
						className="w-[80%] mx-auto"
					/>
				</div>

				{/* Loading Animation */}
				<div className="flex items-center gap-2 mb-4">
					<div className="flex gap-1">
						{[0, 1, 2].map((index) => (
							<div
								key={index}
								className="w-2 h-2 bg-[#00C771] rounded-full animate-bounce"
								style={{
									animationDelay: `${index * 0.15}s`,
									animationDuration: "0.8s",
								}}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<LocaleContext.Provider value={ctx}>
			<NextIntlClientProvider locale={locale} messages={messages}>
				{children}
			</NextIntlClientProvider>
		</LocaleContext.Provider>
	);
}

export function useLocaleContext() {
	const v = useContext(LocaleContext);
	if (!v)
		throw new Error("useLocaleContext must be used within LocaleProvider");
	return v;
}

export function useTranslations(namespace?: string) {
	return useNextIntlTranslations(namespace);
}
