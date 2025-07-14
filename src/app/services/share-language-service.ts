import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ShareLanguageService {
    language: WritableSignal<string> = signal("");
    constructor() {}
    setLanguage(lang: string) {
        this.language.set(lang);
    }
}
