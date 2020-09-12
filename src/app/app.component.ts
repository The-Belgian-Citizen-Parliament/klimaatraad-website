import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  smallHeader = false;
  lang = 'nl';

  constructor(public router: Router, private translate: TranslateService) {
    translate.setDefaultLang(this.lang);
    translate.use(this.lang);

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
  }
}
