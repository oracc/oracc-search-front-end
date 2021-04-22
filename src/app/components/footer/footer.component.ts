import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnChanges {
  @Input() public shouldAdjustFooter: boolean;

  constructor() { }

  ngOnChanges() {
	if(this.shouldAdjustFooter) {
		document.querySelector('.footer').classList.add('footer--adjusted');
	}
  }

}
