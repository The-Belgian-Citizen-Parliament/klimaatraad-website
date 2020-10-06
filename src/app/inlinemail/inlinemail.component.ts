import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import * as dayjs from 'dayjs';

import { Mail } from '../mail/mail';
import { MailService } from '../mail/mail.service';
import { MP } from '../mail/mp';
import { mpsBrussels } from '../mail/mps/brussels';
import { mpsFederal } from '../mail/mps/federal';
import { mpsFlemish } from '../mail/mps/flemish';
import { mpsWalloon } from '../mail/mps/walloon';
import { LanguageService } from '../common/language.service';
import { mailOptions } from '../mail/mail-options';

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

  // constituenciesPerLanguage = {
  //   nl: ['Antwerpen', 'Limburg', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'West-Vlaanderen'],
  //   fr: ['Henegouwen', 'Luik', 'Luxemburg', 'Namen', 'Waals-Brabant'],
  //   en: ['Antwerpen', 'Henegouwen', 'Limburg', 'Luik', 'Luxemburg', 'Namen', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'Waals-Brabant', 'West-Vlaanderen'],
  // };

  constituencies: string[] = ['Antwerpen', 'Brussel-Hoofdstad', 'Henegouwen', 'Limburg', 'Luik', 'Luxemburg', 'Namen', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'Waals-Brabant', 'West-Vlaanderen'];

  // partiesPerLanguage = {
  //   nl: ['Ecolo-Groen', 'PVDA-PTB', 'N-VA', 'VB', 'CD&V', 'Open Vld', 'sp.a', 'ONAFH'],
  //   fr: ['Ecolo-Groen', 'PVDA-PTB', 'PS', 'MR', 'cdH', 'DéFI', 'ONAFH'],
  //   en: ['Ecolo-Groen', 'PVDA-PTB', 'N-VA', 'VB', 'PS', 'CD&V', 'Open Vld', 'sp.a', 'MR', 'cdH', 'DéFI', 'ONAFH'],
  // }

  // excludedParties = ['PVDA-PTB', 'N-VA', 'VB', 'cdH', 'DéFI', 'ONAFH'];

  parties: string[] = ['Ecolo-Groen', 'PVDA-PTB', 'N-VA', 'VB', 'PS', 'CD&V', 'Open Vld', 'sp.a', 'MR', 'cdH', 'DéFI', 'ONAFH'];

  mailOptions;

  selectionFilterSet = false;
  selectionComplete = false;
  personalDataComplete = false;
  consentGiven = false;
  sent = false;

  mailType = 'self';
  selectedMpListExpanded = false;

  isBrowser = false;
  getMailsTimer = null;

  constructor(@Inject(PLATFORM_ID) platformId: string, private mailService: MailService,
    private languageService: LanguageService, private viewportScroller: ViewportScroller) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.newMail = new Mail();
    this.newMail.email = '';
    this.newMail.to = '';
    this.newMail.firstName = '';
    this.newMail.lastName = '';
    this.newMail.allowPublic = true;
    this.newMail.allowReplies = true;
    this.newMail.stayUpToDate = false;
    this.newMail.sentOn = new Date();

    languageService.lang.subscribe((lang) => {
      //this.parties = this.partiesPerLanguage[lang];
      //this.constituencies = ['Brussel-Hoofdstad', ...this.constituenciesPerLanguage[lang]];
      this.clearSelected();
      this.clearFilters();
      this.newMail.lang = lang;
      this.mailOptions = lang === 'nl' ? mailOptions.nl : mailOptions.fr;
    });
  }

  ngOnInit() {
    this.getMails();

    if (this.isBrowser) {
      this.sent = localStorage.getItem('sent') ? true : false;
      this.getMailsTimer = setInterval(() => this.getMails(), 10000);
    }
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
    this.newMail.to = this.selectedMps.map(mp => mp.email).join(', ');
    this.mailService.createMail(this.newMail).then(() => this.getMails());
    this.sent = true;
    localStorage.setItem('sent', 'true');
    setTimeout(() => this.viewportScroller.scrollToAnchor('thanks'));
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
    const lang = this.languageService.lang.value;

    let ignoredparties = [];
    let ignoredConstituencies = [];

    // if (lang === 'nl') {
    //   ignoredConstituencies = this.constituenciesPerLanguage['fr'];
    // } else if (lang === 'fr') {
    //   ignoredConstituencies = this.constituenciesPerLanguage['nl'];
    // }

    this.filteredMps = this.mps
      .filter(mp =>
        (!this.selectedParliament || (mp.parliament === this.selectedParliament)) &&
        (!this.selectedConstituency || (mp.constituency === this.selectedConstituency)) &&
        (!this.selectedParty || (mp.party === this.selectedParty)) &&
        //(!this.excludedParties.includes(mp.party)) &&
        (!ignoredConstituencies.includes(mp.constituency)) &&
        (!ignoredparties.includes(mp.party)) &&
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
    // if (completed) {
    //   this.newMail.body += this.newMail.firstName + ' ' + this.newMail.lastName;
    // } else {
    //   this.newMail.body = this.newMail.body.replace(this.newMail.firstName + ' ' + this.newMail.lastName, '');
    // }
  }

  clearFilters() {
    this.filteredMps = [];
    this.nameFilter = null;
    this.selectedConstituency = null;
    this.selectedParty = null;
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

  mailTypeChanged() {
    if (this.mailType === 'self') {
      this.newMail.subject = '';
      this.newMail.body = '';
    } else if (this.mailType === 'emergency') {
      this.newMail.subject = this.mailOptions[0].subject;
      this.newMail.body = this.mailOptions[0].body + this.newMail.firstName + ' ' + this.newMail.lastName;
    } else {
      this.newMail.subject = this.mailOptions[1].subject;
      this.newMail.body = this.mailOptions[1].body + this.newMail.firstName + ' ' + this.newMail.lastName;
    }
  }
}
