import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  isDevMode
} from "@angular/core";

@Component({
  selector: "app-cookies",
  templateUrl: "./cookies.component.html",
  styleUrls: ["./cookies.component.scss"]
})
export class CookiesComponent implements OnInit {
  public isHidden = isDevMode() ? true : false;
  @Output() public cookieHiddenEvent = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public acceptCookies() {
    this.isHidden = true;
    this.cookieHiddenEvent.emit(true);
  }
}
