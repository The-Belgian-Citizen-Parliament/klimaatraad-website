import { Inject, NgModule } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Request } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFSLoaderFactory
      }
    })
  ]
})
export class I18nServerModule {
  constructor(translate: TranslateService, @Inject(REQUEST) req: Request) {
    const lang = environment.language;

    translate.addLangs(['en', 'ru']);
    translate.use(lang);
  }
}

export class TranslateFSLoader implements TranslateLoader {
  constructor(private prefix = 'i18n', private suffix = '.json') { }

  /**
   * Gets the translations from the server, store them in the transfer state
   */
  public getTranslation(lang: string): Observable<any> {
    const path = join(__dirname, '../browser/assets/', this.prefix, `${lang}${this.suffix}`);
    const data = JSON.parse(readFileSync(path, 'utf8'));

    return of(data);
  }
}

export function translateFSLoaderFactory() {
  return new TranslateFSLoader();
}
