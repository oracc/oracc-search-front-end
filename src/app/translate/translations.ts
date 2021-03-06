import { InjectionToken } from '@angular/core';

// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_AR_NAME, LANG_AR_TRANS } from './lang-ar';
// further translation files should go here

// translation token
export const TRANSLATIONS = new InjectionToken<string>('translations');

// all translations
const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_AR_NAME]: LANG_AR_TRANS,
    // other languages should have a similar entry here
};

// providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];
