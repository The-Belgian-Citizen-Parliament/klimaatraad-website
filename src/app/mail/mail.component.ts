import { Component } from '@angular/core';
import { Mail } from './mail';
import { MailService } from './mail.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
  mails: Mail[];
  newMail: Mail;

  constructor(private mailService: MailService) {
    this.newMail = new Mail();
    this.newMail.from = 'vincent_sels@hotmail.com';
    this.newMail.to = 'vincent_sels@hotmail.com';
    this.newMail.city = 'Anderlecht';
    this.newMail.subject = 'Test subject ' + new Date();
    this.newMail.body = 'Test body ' + new Date();
  }

  ngOnInit() {
    this.mailService
      .getLastMails()
      .then((mails: Mail[]) => {
        this.mails = (mails || []).filter(m => m.from);
      });
  }

  sendMail() {
    this.mailService.createMail(this.newMail).then(m => this.mails = [
      m as Mail,
      ...this.mails,
    ]);
  }
}
