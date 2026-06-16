"use client";

import { useTranslation } from "@/context/i18nContext";
import { Language } from "@/locales/translations";

const languages: { value: Language; label: string }[] = [
  { value: "es", label: "ESPAÑOL" },
  { value: "en", label: "ENGLISH" },
  { value: "pt", label: "PORTUGUES" },
];

export const LanguageSelector = () => {

  
  const { language, setLanguage } = useTranslation();
  // const { language, setLanguage } = useContext(I18nContext);

  return (
    <>
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="border rounded px-2 py-1 text-sm bg-white text-black "
      >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>

      </>
  );
};
