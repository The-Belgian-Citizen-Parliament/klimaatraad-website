import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Mail } from './mail';
import { environment } from 'src/environments/environment';

@Injectable()
export class MailService {
    private baseUrl = environment.baseUrl + '/api/mails';

    constructor(private http: HttpClient) {}

    getLastMails(): Promise<void | Mail[]> {
      return this.http.get<Mail[]>(this.baseUrl + '/last')
                 .toPromise()
                 .catch(this.handleError);
    }

    createMail(newMail: Mail): Promise<void | Mail> {
      return this.http.post<Mail>(this.baseUrl, newMail)
                 .toPromise()
                 .catch(this.handleError);
    }

    private handleError(error: any) {
      const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : error;
      console.error('Error trying to call API: ', errMsg); // log to console instead
    }
}
