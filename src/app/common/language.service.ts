import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class LanguageService {
  public lang = new BehaviorSubject<string>(environment.language);

  private routeMap = {
    nl: {
      'proposal': 'voorstel',
      'participate': 'deelnemen',
      'about': 'over',
      'question': 'vraag',
    },
    fr: {
      'proposal': 'proposition',
      'participate': 'participer',
      'about': 'a-propos',
    }
  }

  route(englishRouteLink, parameter = null): Observable<string> {
    return this.lang.pipe(map((lang) => {
      let translatedLink = '';
      if (lang === 'en') translatedLink = '/' + englishRouteLink;
      else translatedLink = '/' + (this.routeMap[lang][englishRouteLink] || englishRouteLink);
      return translatedLink + (parameter ? ('/' + parameter) : '');
    }));
  }
}
