import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const translations = {
  es,
  en,
  pt,
};

console.log(translations)

export type Language = "es" | "en" | "pt";
export type Translations = typeof es;


