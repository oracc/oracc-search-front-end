import { InjectionToken } from '@angular/core';

// translation token
export const TRANSLATIONS = new InjectionToken<string>('translations');

// all translations (initially empty)
const dictionary = {
    'en': {},
    'ar': {},
    // other languages should have a similar entry here
};

// providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];
