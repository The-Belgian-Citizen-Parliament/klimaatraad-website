import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import * as dayjs from 'dayjs';
import 'dayjs/locale/nl';
import 'dayjs/locale/fr';
import * as relativeTime from 'dayjs/plugin/relativeTime';

import { environment } from 'src/environments/environment';
import { SeoService } from './seo.service';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  smallHeader = false;
  lang = environment.language;

  constructor(@Inject(PLATFORM_ID) platformId: string, public router: Router,
    activatedRoute: ActivatedRoute, private translate: TranslateService,
    private seoService: SeoService) {

    this.setTitleAndDescription();

    combineLatest([this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => ({ activatedRoute, event })),
      map(({ activatedRoute, event }) => {
        while (activatedRoute.firstChild) activatedRoute = activatedRoute.firstChild;
        return { activatedRoute, event };
      }),
      filter(({ activatedRoute, event }) => activatedRoute.outlet === 'primary'),
    ), this.translate.get(['title', 'description'])]).subscribe(([{ activatedRoute, event }, trans]) => {
      const url = (event as NavigationEnd).url;
      if (url.includes('vraag') || url.includes('question')) {
        // Set by question component
      } else {
        // Set the default
        const title = trans['title'];
        const description = trans['description'];

        seoService.updateDescription(description);
        if (activatedRoute.snapshot.data['title']) {
          seoService.updateTitle(translate.instant(activatedRoute.snapshot.data['title']) + ' - ' + title);
        } else {
          seoService.updateTitle(title);
        }
      }
    });

    if (isPlatformBrowser(platformId)) {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
    }

    if (environment.language === 'nl') dayjs.locale('nl');
    else if (environment.language === 'fr') dayjs.locale('fr');
    dayjs.extend(relativeTime);
  }

  setLanguage(lang) {
    this.lang = lang;
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.setTitleAndDescription();
  }

  setTitleAndDescription() {
    this.translate.get('title').subscribe((title) => this.seoService.updateTitle(title));
    this.translate.get('description').subscribe((description) => this.seoService.updateDescription(description));
  }
}
