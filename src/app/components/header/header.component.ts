import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from 'src/utils/consts';
import { ShareLanguageService } from 'src/app/services/share-language-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
  isDesktop = 600 < window.innerWidth;
  routerLinks = document.querySelectorAll('[routerLink]');
  isMenuOpen = false;
  imgURL: string = 'assets/img/oracc-header.jpeg';
  shareLanguageService = inject(ShareLanguageService);

  constructor(public translate: TranslateService) {
    translate.addLangs([LANGUAGE.ENGLISH, LANGUAGE.ARABIC]);
    translate.setDefaultLang(LANGUAGE.ENGLISH);
    const browserLang = translate.getBrowserLang();
    const newLang = browserLang.match(/en|ar/) ? browserLang : LANGUAGE.ENGLISH;
    translate.use(newLang);
    this.shareLanguageService.setLanguage(newLang);
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
      this.shareLanguageService.setLanguage(LANGUAGE.ENGLISH);
    } else if (lang.id === LANGUAGE.ARABIC) {
      this.translate.use(LANGUAGE.ARABIC);
      this.htmlTag.setAttribute('dir', 'rtl');
      this.htmlTag.setAttribute('lang', LANGUAGE.ARABIC);
      lang.parentNode.childNodes.forEach((elem) => {
        elem.classList.remove('header__nav-lang-link--active');
      });
      lang.classList.add('header__nav-lang-link--active');
      this.shareLanguageService.setLanguage(LANGUAGE.ARABIC);
    }
  }

  public toggleNavPanel() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeNavPanel(e) {
    if (
      e.target.hasAttribute('routerLink') &&
      window.innerWidth <= 600 &&
      this.isMenuOpen
    ) {
      this.toggleNavPanel();
    }
  }
}
