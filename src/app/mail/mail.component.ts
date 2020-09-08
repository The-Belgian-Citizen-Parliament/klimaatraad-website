import { Component } from '@angular/core';
import { Mail } from './mail';
import { MailService } from './mail.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
  mails: Mail[];
  newMail: Mail = new Mail();

  constructor(private mailService: MailService) { }

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
