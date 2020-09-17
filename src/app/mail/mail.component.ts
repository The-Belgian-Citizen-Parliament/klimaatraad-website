import { Component } from '@angular/core';
import { Mail } from './mail';
import { MailService } from './mail.service';
import { environment } from 'src/environments/environment';
import { members } from './kamer-members';
import { MP } from './mp/mp';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
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

  selectionFilterSet = false;
  selectionComplete = false;
  personalDataComplete = false;

  selectedMpListExpanded = false;

  constructor(private mailService: MailService) {
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
    this.newMail.subject = 'Laat burgers zelf maatregelen uitwerken tegen ecologische crises!';
    this.newMail.body = 'Een groep van 101 gelote burgers die rekening houdend met demografische criteria een representatieve dwarsdoorsnede vormt van de totale Belgische bevolking, buigt zich, geïnformeerd door een brede waaier experten en belanghebbenden, tussen 20 november 2020 en 7 maart 2021 over de volgende vraag: “Hoe kunnen bij de uitoefening van hun respectieve bevoegdheden de federale Staat, de gemeenschappen en de gewesten bijdragen tot de maximalisering van de kansen om het Belgische territorium en de planeet in haar totaliteit bewoonbaar te houden voor de huidige en toekomstige generaties?”\n\n' +
'Het deliberatieve proces loopt over acht sessies van telkens drie dagen en telt vier belangrijke fasen: leren, consulteren, beraadslagen en beslissen. Om de participatiedrempel te verlagen ontvangen de leden van het Nationale Burgerparlement dagvergoedingen, transportvergoedingen, accommodatie en kinderopvang. Elk van hun beleidsvoorstellen wordt door de bevoegde regering(en) geïmplementeerd of ter stemming voorgelegd aan het bevoegde parlement of de bevoegde parlementen. Op aanvaarde, afgewezen of gewijzigde voorstellen volgen telkens grondige publieke motivaties.\n\n' +
'Om elke schijn van partijdigheid te vermijden, speelt Extinction Rebellion zelf geen rol in de organisatie van het deliberatieve proces, de selectie van het deskundigenpanel of het toezicht. Het Nationale Burgerparlement wordt geïnitieerd en gefinancierd door de federale regering. Een coördinatiegroep, adviesraad, facilitatieteam, legistiek comité en toezichtpanel zorgen samen voor een goede gang van zaken en waarborgen de publieke transparantie, politieke onafhankelijkheid en democratische legitimiteit ervan.\n\n';
  }

  ngOnInit() {
    this.mailService
      .getLastMails()
      .then((mails: Mail[]) => {
        this.mails = (mails || []);
      });
  }

  sendMail() {
    this.mailService.createMail(this.newMail).then(m => this.mails = [
      m as Mail,
      ...this.mails,
    ]);
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
    this.filteredMps = this.mps.filter(mp =>
      (!this.selectedConstituency || (mp.constituency === this.selectedConstituency)) &&
      (!this.selectedParty || (mp.party === this.selectedParty)) &&
      (!this.nameFilter || (mp.name.toLowerCase().includes(this.nameFilter.toLowerCase()))));

    if (this.selectedConstituency || this.selectedParty || (this.nameFilter  && this.nameFilter.length > 2)) {
      this.selectionFilterSet = true;
    } else {
      this.selectionFilterSet = false;
    }
  }

  selectAllVisibleFiltered() {
    const newMps = this.filteredMps.filter(mp => !this.selectedMps.includes(mp));
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
}
