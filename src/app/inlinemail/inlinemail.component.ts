import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import * as dayjs from 'dayjs';

import { environment } from 'src/environments/environment';
import { Mail } from '../mail/mail';
import { NL_SUBJECTS, FR_SUBJECTS, NL_BODIES, FR_BODIES } from '../mail/mail-options';
import { MailService } from '../mail/mail.service';
import { MP } from '../mail/mp';
import { mpsBrussels } from '../mail/mps/brussels';
import { mpsFederal } from '../mail/mps/federal';
import { mpsFlemish } from '../mail/mps/flemish';
import { mpsWalloon } from '../mail/mps/walloon';
import { tweets } from '../mail/tweets';

@Component({
  selector: 'app-inlinemail',
  templateUrl: './inlinemail.component.html',
  styleUrls: ['./inlinemail.component.scss'],
  animations: [
    trigger("inOutAnimation", [
      state("in", style({ opacity: 1 })),
      transition(":enter", [
        animate(
          300,
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.25, offset: 0.25 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 0.75, offset: 0.75 }),
            style({ opacity: 1, offset: 1 }),
          ])
        )
      ]),
      transition(":leave", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 0.75, offset: 0.25 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 0.25, offset: 0.75 }),
            style({ opacity: 0, offset: 1 }),
          ])
        )
      ])
    ])
  ]
})
export class InlineMailComponent implements OnInit, OnDestroy {
  @ViewChild('customSubject') customSubjectElement: ElementRef;

  lang = environment.language;

  mails: Mail[];
  newMail: Mail;
  mps: MP[] = [...mpsFederal, ...mpsBrussels, ...mpsFlemish, ...mpsWalloon ];
  filteredMps: MP[] = [];
  selectedMps: MP[] = [];

  selectType?: string = null;
  askForLocation = false;
  noAutoLocation = true;
  selectedParliament?: string = 'Federal';
  selectedConstituency?: string = null;
  selectedParty?: string  = null;
  nameFilter?: string  = null;

  parliaments = ['Federal', 'Flemish', 'Walloon', 'Brussels Parliament'];

  constituencies = [
    'Antwerpen', 'Brussel-Hoofdstad', 'Henegouwen', 'Limburg', 'Luik', 'Luxemburg', 'Namen', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'Waals-Brabant', 'West-Vlaanderen'];

  parties = [
    'PVDA-PTB', 'Ecolo-Groen', 'N-VA', 'PS', 'CD&V', 'Open Vld', 'sp.a', 'VB', 'MR', 'cdH', 'DéFI'];

  subjects = [];
  bodies = [];

  selectionFilterSet = false;
  selectionComplete = false;
  personalDataComplete = false;
  consentGiven = false;
  sent = false;

  customSubject = false;
  selectedMpListExpanded = false;

  isBrowser = false;
  getMailsTimer = null;

  constructor(@Inject(PLATFORM_ID) platformId: string, private mailService: MailService) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.subjects = environment.language === 'nl' ? NL_SUBJECTS : FR_SUBJECTS;
    this.bodies = environment.language === 'nl' ? NL_BODIES : FR_BODIES;

    this.newMail = new Mail();
    this.newMail.email = 'vincent.sels@gmail.com';
    this.newMail.to = 'vincent_sels@hotmail.com';
    this.newMail.city = 'Anderlecht';
    this.newMail.postalCode = '1070';
    this.newMail.firstName = 'Vincent';
    this.newMail.lastName = 'Sels';
    this.newMail.lang = environment.language;
    this.newMail.allowPublic = true;
    this.newMail.allowReplies = true;
    this.newMail.stayUpToDate = false;
    this.newMail.sentOn = new Date();
    this.newMail.subject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
    this.newMail.body = this.bodies[Math.floor(Math.random() * this.bodies.length)];
  }

  ngOnInit() {
    this.getMails();

    if (this.isBrowser) this.getMailsTimer = setInterval(() => this.getMails(), 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.getMailsTimer);
  }

  getMails() {
    this.mailService
      .getLastMails()
      .then((mails: Mail[]) => {
        this.mails = (mails || []);
      });
  }

  formatRelativeTime = (sentOn) => dayjs().to(sentOn);
  mailTrackBy = (idx, mail: Mail) => mail.sentOn;

  sendMail() {
    this.mailService.createMail(this.newMail).then(() => this.getMails());
    this.sent = true;
  }

  // TODO when we have time
  // detectLocation() {
  //   if (navigator.geolocation) {
  //     this.askForLocation = true;
  //     setTimeout(() => {
  //       navigator.geolocation.getCurrentPosition((position) => {
  //         this.askForLocation = false;
  //         console.log(position);
  //       }, (error) => {
  //         this.noAutoLocation = true;
  //       });
  //     });
  //   } else {
  //     this.noAutoLocation = true;
  //   }
  // }

  filterMps() {
    this.filteredMps = this.mps
      .filter(mp =>
        (!this.selectedParliament || (mp.parliament === this.selectedParliament)) &&
        (!this.selectedConstituency || (mp.constituency === this.selectedConstituency)) &&
        (!this.selectedParty || (mp.party === this.selectedParty)) &&
        (!this.nameFilter || ((mp.firstName + ' ' + mp.lastName).toLowerCase().includes(this.nameFilter.toLowerCase()))))
      .sort((a, b) => (a.email || 'ZZZZ').localeCompare(b.email || 'ZZZZ'));

    if (this.selectedConstituency || this.selectedParty || (this.nameFilter  && this.nameFilter.length > 2)) {
      this.selectionFilterSet = true;
    } else {
      this.selectionFilterSet = false;
    }
  }

  selectAllVisibleFiltered() {
    const newMps = this.filteredMps.filter(mp => !this.selectedMps.includes(mp) && mp.email);
    newMps.forEach(mp => mp.selected = true);
    this.selectedMps.push(...newMps);
  }

  confirmSelection() {
    this.selectionComplete = true;
  }

  completePersonalData(completed) {
    this.personalDataComplete = completed;
    if (completed) {
      this.newMail.body += this.newMail.firstName + ' ' + this.newMail.lastName;
    } else {
      this.newMail.body = this.newMail.body.replace(this.newMail.firstName + ' ' + this.newMail.lastName, '');
    }
  }

  clearSelected() {
    this.selectedMps = [];
    this.mps.forEach(mp => mp.selected = false)
  }

  mpSelected(mp) {
    if (this.selectedMps.includes(mp)) return;
    this.selectedMps.push(mp);
  }

  mpDeselected(mp) {
    this.selectedMps = this.selectedMps.filter(s => s !== mp);
  }

  subjectChanged() {
    if (!this.newMail.subject) {
      this.customSubject = true;
      setTimeout(() => this.customSubjectElement.nativeElement.focus());
    }
  }

  getRandomTwitterUrl() {
    const twitterContent = tweets[this.lang];
    const randomText = twitterContent.texts[Math.floor(Math.random() * twitterContent.texts.length)];
    const base = 'https://twitter.com/intent/tweet?text='
    const tweet = encodeURIComponent(`${randomText} ${twitterContent.tags} ${twitterContent.url}`);
    return base + tweet;
  }
}