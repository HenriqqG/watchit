import englishTranslation from '../translations/languages/en-US.json';
import ptbrTranslation from '../translations/languages/pt-br.json';
import spanishTranslation from '../translations/languages/arg.json';

export interface Language {
  id: string;
  name: string;
  translations: { [key: string]: string };
}

export const languages: Language[] = [
  { id: 'en', name: 'English', translations: englishTranslation },
  { id: 'pt-br', name: 'Português (Brasil)', translations: ptbrTranslation },
  { id: 'es', name: 'Español', translations: spanishTranslation },
];

export function tl(language: Language, text: string, params?: { [key: string]: string | number }) {
    
    let translatedText =
        language.translations[text] ||
        languages.find((language) => language.id === 'en')?.translations[text] ||
        text;

    if (params) {
        Object.keys(params).forEach(key => {
            const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            translatedText = translatedText.replace(placeholder, String(params[key]));
        });
    }

    return translatedText;
}

export function saveLanguage(language: Language) {
  try {
    localStorage.setItem("selectedLanguageId", language.id);
  } catch (error) {
    console.error("Failed to save language to localStorage:", error);
  }
}