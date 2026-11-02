import {
  createContext,
  createEffect,
  createSignal,
  useContext,
  type JSX,
} from "solid-js";
import {
  dictionaries,
  translateCategory,
  translateCondition,
  type Language,
  type TranslationKey,
} from "../lib/i18n";

const STORAGE_KEY = "gigsn_lang";

interface I18nContextValue {
  lang: () => Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  categoryLabel: (value: string) => string;
  conditionLabel: (value: string) => string;
  statusLabel: (value: string) => string;
}

const I18nContext = createContext<I18nContextValue>();

function readLang(): Language {
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ka";
  } catch {
    return "ka";
  }
}

export function I18nProvider(props: { children: JSX.Element }) {
  const [lang, setLangSignal] = createSignal<Language>(readLang());

  createEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang());
    } catch {
      /* ignore storage errors */
    }
    document.documentElement.lang = lang();
  });

  function setLang(next: Language) {
    setLangSignal(next);
  }

  function t(
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string {
    let str: string = dictionaries[lang()][key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{${k}}`, String(v));
      }
    }
    return str;
  }

  const categoryLabel = (value: string) => translateCategory(lang(), value);
  const conditionLabel = (value: string) => translateCondition(lang(), value);

  const statusLabel = (value: string) => {
    const map: Record<string, TranslationKey> = {
      pending: "status.pending",
      confirmed: "status.confirmed",
      shipped: "status.shipped",
      delivered: "status.delivered",
      cancelled: "status.cancelled",
    };
    const key = map[value];
    return key ? t(key) : value;
  };

  return (
    <I18nContext.Provider
      value={{ lang, setLang, t, categoryLabel, conditionLabel, statusLabel }}
    >
      {props.children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
