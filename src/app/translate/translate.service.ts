import {Injectable, Inject} from '@angular/core';
import { TRANSLATIONS } from './translations'; // import our opaque token

export interface Language {
  display: string;
  value: string;
}

@Injectable()
export class TranslateService {
    private _currentLang: string;
    private supportedLanguages : Language[];

    public get currentLang() {
        return this._currentLang;
    }

    // inject our translations
    constructor(@Inject(TRANSLATIONS) private _translations: any) {
      this.supportedLanguages = [
        { display: 'English', value: 'en' },
        { display: 'Arabic', value: 'ar'},
        // new languages go here so that there is a button for selecting them
      ];
      this.use('en');
    }

    public use(lang: string): void {
        // set current language
        this._currentLang = lang;
    }

    public isRtl(): boolean {
        // TODO generalise!
        return (this._currentLang == "ar");
    }

    public getSupportedLanguages(): Language[] {
        return this.supportedLanguages;
    }

    private translate(key: string): string {
        // private perform translation
        let translation = key;

        if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
            return this._translations[this.currentLang][key];
        }
        console.log(`Not found translation for ${key} in ${this._currentLang}`);
        return translation;
    }

    public instant(key: string) {
        // call translation
        return this.translate(key);
    }
}
