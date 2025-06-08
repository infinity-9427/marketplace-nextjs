export enum SupportedLanguage {
  ENGLISH = 'en',
  SPANISH = 'es'
}

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  [SupportedLanguage.ENGLISH]: {
    code: SupportedLanguage.ENGLISH,
    name: 'English',
    flag: '🇺🇸'
  },
  [SupportedLanguage.SPANISH]: {
    code: SupportedLanguage.SPANISH,
    name: 'Español',
    flag: '🇪🇸'
  }
};