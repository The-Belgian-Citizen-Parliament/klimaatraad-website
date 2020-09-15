import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  smallHeader = false;
  lang = environment.language;

  constructor(public router: Router, private translate: TranslateService) {
    router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
   ).subscribe((e: NavigationEnd) => {
    this.smallHeader = e.url !== "/";
   });
  }

  setLanguage(lang) {
    console.log('In setLanguge in app.component', lang, environment);
    this.lang = lang;
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
  }
}
