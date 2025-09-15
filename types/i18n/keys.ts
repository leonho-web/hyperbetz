// Auto-typed translation keys based on the English dictionary
// Add new keys to `Dictionary/en.json` to get type safety everywhere

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5];

export type Paths<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? K | Join<K, Paths<T[K], Prev[D]>>
        : K;
    }[keyof T & (string | number)]
  : never;

// Import the base dictionary to infer keys
// Note: This import is types-only and will be erased at compile time
import en from "@/Dictionary/en.json";

export type TranslationSchema = typeof en;

// All possible dotted paths into the translation schema
export type I18nKeys = Paths<TranslationSchema>;
