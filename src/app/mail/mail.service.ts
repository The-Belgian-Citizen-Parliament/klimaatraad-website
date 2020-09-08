import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Mail } from './mail';

@Injectable()
export class MailService {
    private MailsUrl = '/api/mails';

    constructor(private http: HttpClient) {}

    getLastMails(): Promise<void | Mail[]> {
      return this.http.get<Mail[]>(this.MailsUrl + '/last')
                 .toPromise()
                 .catch(this.handleError);
    }

    createMail(newMail: Mail): Promise<void | Mail> {
      return this.http.post<Mail>(this.MailsUrl, newMail)
                 .toPromise()
                 .catch(this.handleError);
    }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
}
