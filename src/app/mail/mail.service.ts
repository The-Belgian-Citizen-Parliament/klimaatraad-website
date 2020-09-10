import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Mail } from './mail';
import { Router } from '@angular/router';

@Injectable()
export class MailService {
    private MailsUrl = '/api/mails';

    constructor(private http: HttpClient, private router: Router) {}

    getLastMails(): Promise<void | Mail[]> {
      console.log('Retrieving latest emails... ');
      return this.http.get<Mail[]>('http://localhost:4200' + this.MailsUrl + '/last')
                 .toPromise()
                 .catch(this.handleError);
    }

    createMail(newMail: Mail): Promise<void | Mail> {
      console.log('Creating new email... ');
      return this.http.post<Mail>('http://localhost:4200' + this.MailsUrl, newMail)
                 .toPromise()
                 .catch(this.handleError);
    }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : error;
      console.error('Error trying to call API: ', errMsg); // log to console instead
    }
}
