"use client";

import { createContext, useContext, useState } from "react";
import { translations, Language, Translations } from "@/locales/translations";

type I18nContextProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

export const I18nContext = createContext<I18nContextProps>(
  {} as I18nContextProps
);

export const useTranslation = () => useContext(I18nContext);

interface Props {
  children: React.ReactNode;
}

export const I18nProvider = ({ children }: Props) => {
  const [language, setLanguage] = useState<Language>("es");

  const t = translations[language];




  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
