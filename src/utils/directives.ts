import {
  OnInit,
  Output,
  Directive,
  EventEmitter
} from '@angular/core';

@Directive({
    selector: '[ngInit]',
    standalone: false
})
export class NgInitDirective implements OnInit {
  @Output('ngInit') callback : EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    this.callback.emit();
  }
}
