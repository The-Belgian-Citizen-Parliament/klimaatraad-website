import { Component, ElementRef, ViewChild } from '@angular/core';
import { Mail } from './mail';
import { MailService } from './mail.service';
import { environment } from 'src/environments/environment';
import { members } from './kamer-members';
import { MP } from './mp/mp';
import { FR_BODIES, FR_SUBJECTS, NL_BODIES, NL_SUBJECTS } from './mail-options';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
  @ViewChild('customSubject') customSubjectElement: ElementRef;

  mails: Mail[];
  newMail: Mail;
  mps: MP[] = members;
  filteredMps: MP[] = [];
  selectedMps: MP[] = [];

  selectType?: string = null;
  askForLocation = false;
  noAutoLocation = true;
  selectedConstituency?: string = null;
  selectedParty?: string  = null;
  nameFilter?: string  = null;

  constituencies = [
    'Antwerpen', 'Brussel-Hoofdstad', 'Henegouwen', 'Limburg', 'Luik', 'Luxemburg', 'Namen', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'Waals-Brabant', 'West-Vlaanderen'];

  parties = [
    'PVDA-PTB', 'Ecolo-Groen', 'N-VA', 'PS', 'CD&V', 'Open Vld', 'sp.a', 'VB', 'MR', 'cdH', 'DéFI'];

  subjects = [];
  bodies = [];

  selectionFilterSet = false;
  selectionComplete = false;
  personalDataComplete = false;
  sent = false;

  customSubject = false;
  selectedMpListExpanded = false;

  constructor(private mailService: MailService) {
    this.subjects = environment.language === 'nl' ? NL_SUBJECTS : FR_SUBJECTS;
    this.bodies = environment.language === 'nl' ? NL_BODIES : FR_BODIES;

    this.newMail = new Mail();
    this.newMail.email = 'vincent.sels@gmail.com';
    this.newMail.to = 'vincent_sels@hotmail.com';
    this.newMail.city = 'Anderlecht';
    this.newMail.postalCode = '1070';
    this.newMail.firstName = 'Vincent';
    this.newMail.lastName = 'Sels';
    this.newMail.allowPublic = true;
    this.newMail.allowReplies = true;
    this.newMail.stayUpToDate = false;
    this.newMail.sentOn = new Date();
    this.newMail.subject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
    this.newMail.body = this.bodies[Math.floor(Math.random() * this.bodies.length)];
  }

  ngOnInit() {
    this.mailService
      .getLastMails()
      .then((mails: Mail[]) => {
        this.mails = (mails || []);
      });
  }

  sendMail() {
    this.mailService.createMail(this.newMail).then(() => this.mails = [
      this.newMail,
      ...this.mails,
    ]);
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
        (!this.selectedConstituency || (mp.constituency === this.selectedConstituency)) &&
        (!this.selectedParty || (mp.party === this.selectedParty)) &&
        (!this.nameFilter || (mp.name.toLowerCase().includes(this.nameFilter.toLowerCase()))))
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
}
