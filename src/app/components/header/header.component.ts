import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from 'src/utils/consts';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
  isDesktop = window.innerWidth < 600 ? false : true;
  routerLinks = document.querySelectorAll('[routerLink]');
  isMenuOpen = false;
  imgURL: string = 'assets/img/oracc-header.jpeg';

  constructor(public translate: TranslateService) {
    translate.addLangs([LANGUAGE.ENGLISH, LANGUAGE.ARABIC]);
    translate.setDefaultLang(LANGUAGE.ENGLISH);
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : LANGUAGE.ENGLISH);
  }

  ngOnInit() {}

  public changeLang(lang) {
    if (lang.id === LANGUAGE.ENGLISH) {
      this.translate.use(LANGUAGE.ENGLISH);
      this.htmlTag.setAttribute('dir', 'ltr');
      this.htmlTag.setAttribute('lang', LANGUAGE.ENGLISH);
      lang.parentNode.childNodes.forEach((elem) => {
        elem.classList.remove('header__nav-lang-link--active');
      });
      lang.classList.add('header__nav-lang-link--active');
    } else if (lang.id === LANGUAGE.ARABIC) {
      this.translate.use(LANGUAGE.ARABIC);
      this.htmlTag.setAttribute('dir', 'rtl');
      this.htmlTag.setAttribute('lang', LANGUAGE.ARABIC);
      lang.parentNode.childNodes.forEach((elem) => {
        elem.classList.remove('header__nav-lang-link--active');
      });
      lang.classList.add('header__nav-lang-link--active');
    }
  }

  public toggleNavPanel() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeNavPanel(e) {
    if (
      e.target.hasAttribute('routerLink') &&
      window.innerWidth < 600 &&
      this.isMenuOpen
    ) {
      this.toggleNavPanel();
    }
  }
}
