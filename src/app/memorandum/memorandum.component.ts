import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import marked from 'marked';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-memorandum',
  templateUrl: './memorandum.component.html',
  styleUrls: ['./memorandum.component.scss']
})
export class MemorandumComponent implements OnInit {
  isBrowser;
  memorandum;

  constructor(@Inject(PLATFORM_ID) platformId: string, httpClient: HttpClient) {
    this.isBrowser = isPlatformBrowser(platformId);

    httpClient.get(environment.baseUrl + '/assets/i18n/memorandum.' + environment.language + '.md',
      { responseType: 'text' }).toPromise()
      .then((text) => this.memorandum = marked(text));
  }

  ngOnInit(): void {

  }
}
