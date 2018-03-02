import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../translate'; // our translate service

@Pipe({
    name: 'translate',
    pure: false // required to have the text update automatically
})

export class TranslatePipe implements PipeTransform {

    constructor(private _translate: TranslateService) { }

    transform(value: string, args: any[]): any {
        if (!value) return;
        return this._translate.instant(value);
    }
}
