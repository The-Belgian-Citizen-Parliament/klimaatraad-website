import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import marked from 'marked';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  privacy;

  constructor(httpClient: HttpClient) {
    httpClient.get(environment.baseUrl + '/assets/i18n/privacy.' + environment.language + '.md',
      { responseType: 'text' }).toPromise()
      .then((text) => this.privacy = marked(text));
  }
}
