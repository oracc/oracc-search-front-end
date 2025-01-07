import { Pipe, PipeTransform } from '@angular/core';

const collate = new Intl.Collator("en").compare
function collate_or_compare(a, b) {
  if (typeof(a) === "number" && typeof(b) === "number") {
    return a - b;
  }
  return collate(a, b)
}

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
  transform(array: any, field: string, desc: boolean): any {
    if (!Array.isArray(array)) {
      return;
    }
    const fn = desc?
      function(x, y) {
        return collate_or_compare(y[field], x[field])
      } :
      function(x, y) {
        return collate_or_compare(x[field], y[field])
      };
    array.sort(fn);
    return array;
  }
}
