import { NgModule } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFSLoaderFactory,
        deps: [TransferState],
      }
    })
  ]
})
export class I18nServerModule {
  constructor(translate: TranslateService) {
    const lang = environment.language;

    translate.addLangs(['nl', 'fr']);
    translate.use(lang);
  }
}

export class TranslateFSLoader implements TranslateLoader {
  constructor(private transferState: TransferState, private prefix = 'i18n', private suffix = '.json') { }

  public getTranslation(lang: string): Observable<any> {
    const path = join(__dirname, '../browser/assets/', this.prefix, `${lang}${this.suffix}`);
    const data = JSON.parse(readFileSync(path, 'utf8'));
    const key = makeStateKey<any>('transfer-translate-' + lang);
    this.transferState.set(key, data);
    return of(data);
  }
}

export function translateFSLoaderFactory(transferState: TransferState) {
  return new TranslateFSLoader(transferState);
}
