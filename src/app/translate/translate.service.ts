import {Injectable, Inject} from '@angular/core';
import { TRANSLATIONS } from './translations'; // import our opaque token

@Injectable()
export class TranslateService {
    private _currentLang: string;

    public get currentLang() {
        return this._currentLang;
    }

    // inject our translations
    constructor(@Inject(TRANSLATIONS) private _translations: object) {
    }

    public use(lang: string): void {
        // set current language
        this._currentLang = lang;
    }

    public isRtl(): boolean {
        // TODO generalise!
        return (this._currentLang == "ar");
    }

    public addTranslations(contributed): void {
        for (let entry in contributed) {
          for (let lang in contributed[entry]) {
            if (this._translations[lang] && entry in this._translations[lang]) {
              console.log(`Entry ${entry} already exists!`);
            }
            this._translations[lang][entry] = contributed[entry][lang];
          }
        }
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
