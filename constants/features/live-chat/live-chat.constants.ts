import { Language, ChatRoom } from "@/types/features/live-chat.types";

// Language options with proper flags
export const languages: Language[] = [
	{ code: "en", name: "English", flag: "🇺🇸", dir: "ltr" },
	{ code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" },
	{ code: "ar", name: "العربية", flag: "🇸🇦", dir: "ltr" }, // TODO rtl
	{ code: "zh", name: "中文", flag: "🇨🇳", dir: "ltr" },
	{ code: "nl", name: "Nederlands", flag: "🇳🇱", dir: "ltr" },
	{ code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
	{ code: "de", name: "Deutsch", flag: "🇩🇪", dir: "ltr" },
	{ code: "hi", name: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
	{ code: "it", name: "Italiano", flag: "🇮🇹", dir: "ltr" },
	{ code: "ja", name: "日本語", flag: "🇯🇵", dir: "ltr" },
	{ code: "ko", name: "한국어", flag: "🇰🇷", dir: "ltr" },
	{ code: "ms", name: "Bahasa Melayu", flag: "🇲🇾", dir: "ltr" },
	{ code: "fa", name: "فارسی", flag: "🇮🇷", dir: "ltr" }, // TODO rtl
	{ code: "pl", name: "Polski", flag: "🇵🇱", dir: "ltr" },
	{ code: "pt", name: "Português", flag: "🇵🇹", dir: "ltr" },
	{ code: "ru", name: "Русский", flag: "🇷🇺", dir: "ltr" },
	{ code: "sv", name: "Svenska", flag: "🇸🇪", dir: "ltr" },
	{ code: "th", name: "ไทย", flag: "🇹🇭", dir: "ltr" },
	{ code: "tr", name: "Türkçe", flag: "🇹🇷", dir: "ltr" },
	{ code: "vi", name: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
];

// Chat room options
export const chatRooms: ChatRoom[] = [
	{ code: "GLOBAL", name: "Global", flag: "🌍" },
	// { code: "VIP", name: "VIP", flag: "👑" },
	// { code: "SPORT", name: "Sport", flag: "⚽" },
	// { code: "PH", name: "Filipino", flag: "🇵🇭" },
	// { code: "RU", name: "Русский", flag: "🇷🇺" },
	// { code: "ES", name: "Español", flag: "🇪🇸" },
	// { code: "IT", name: "Italiana", flag: "🇮🇹" },
	// { code: "ID", name: "Indonesian", flag: "🇮🇩" },
	// { code: "IN", name: "Indian", flag: "🇮🇳" },
	// { code: "TR", name: "Türkçe", flag: "🇹🇷" },
	// { code: "FR", name: "Français", flag: "🇫🇷" },
	// { code: "DE", name: "Deutsch", flag: "🇩🇪" },
	// { code: "PL", name: "Polski", flag: "🇵🇱" },
	// { code: "PT", name: "Português", flag: "🇵🇹" },
];
