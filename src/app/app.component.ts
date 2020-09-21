import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  smallHeader = false;
  lang = environment.language;

  constructor(public router: Router, private translate: TranslateService, private title: Title) {
    this.setTitle();
    router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
   ).subscribe((e: NavigationEnd) => {
    this.smallHeader = e.url !== "/";
   });
  }

  setLanguage(lang) {
    this.lang = lang;
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.setTitle();
  }

  setTitle() {
    this.title.setTitle(
      this.lang === 'nl' ? 'Het Burgerparlement'
        : this.lang === 'fr' ? 'Le Parlement Citoyen'
        : 'The Citizens Parliament');
  }
}
