import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-cookies",
  templateUrl: "./cookies.component.html",
  styleUrls: ["./cookies.component.scss"]
})
export class CookiesComponent implements OnInit {
  public isHidden = false;
  @Output() public cookieHiddenEvent = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public acceptCookies() {
    this.isHidden = true;
    this.cookieHiddenEvent.emit(true);
  }
}
