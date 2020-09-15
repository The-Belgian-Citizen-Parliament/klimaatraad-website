import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateCacheModule, TranslateCacheService, TranslateCacheSettings } from 'ngx-translate-cache';
import { BrowserTransferStateModule, makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    }),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: translateCacheFactory,
        deps: [TranslateService, TranslateCacheSettings]
      },
      cacheMechanism: 'Cookie'
    }),
    BrowserTransferStateModule,
  ],
  exports: [TranslateModule]
})
export class I18nBrowserModule {
  constructor(
    translate: TranslateService,
    translateCacheService: TranslateCacheService
  ) {
    const lang = environment.language;

    console.log('Setting up onLangChange');

    translate.onLangChange.subscribe((l, e, c) => {
      if (e) console.log('error in onLangChange');
      else if (l) console.log('Lang changed to', l);
      else if (c) console.log('Lang completed', c);
    })

    console.log('In browser i18n module; before init', lang, environment);

    translateCacheService.init();

    console.log('In browser i18n module; after init, before addLangs', lang, environment);

    translate.addLangs(['nl', 'fr']);

    console.log('In browser i18n module; after add langs, before set default lang', lang, environment);

    translate.setDefaultLang(lang);

    console.log('In browser i18n module; after set default lang, before use', lang, environment);

    translate.use(lang);

    console.log('In browser i18n module; after use lang', lang, environment);
  }
}

export function translateLoaderFactory(httpClient: HttpClient, transferState: TransferState) {
  return new TranslateBrowserLoader(transferState, httpClient);
}

export function translateCacheFactory(
  translateService: TranslateService,
  translateCacheSettings: TranslateCacheSettings
) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private http: HttpClient,
    private prefix: string = 'assets/i18n/',
    private suffix: string = '.json',
  ) { }

  public getTranslation(lang: string): Observable<any> {
    const key = makeStateKey<any>('transfer-translate-' + lang);
    const data = this.transferState.get(key, null);

    // First we are looking for the translations in transfer-state, if none found, http load as fallback
    return data
      ? of(data)
      : new TranslateHttpLoader(this.http, this.prefix, this.suffix).getTranslation(lang);
  }
}
