export const questions: Question[] = [
  {
    question: 'Zijn jullie links of rechts?',
    summary: 'Geen van beiden! Onze organisatie is volledig a-politiek en niet-ideologisch.',
    answer: '',
    tags: ['Politiek', 'Ideologie'],
    slug: 'links-of-rechts',
  },
  {
    question: 'Als eender wie geloot kan worden in de assembly, hoe voorkom je dat mensen het verpesten?',
    summary: 'Onderzoek wijst uit dat wanneer je mensen een verantwoordelijkheid geeft, ze die erg serieus nemen. Bovendien krijgen deelnemers een opleiding, en zien moderators er continue op toe dat alles in goede banen verloopt.',
    answer: 'First, countless deliberative democratic experiments have proven that, when people are given **responsibility**, they tend to take that very seriously. Second, moderators will always have a hand in keeping the peace and common decency.\n\nWhen **complaints** are raised against a participant, he will be fairly judged, and possibly expelled from further participation.',
    tags: ['Politiek', 'Ideologie'],
    slug: 'om-het-even-wie',
  },
  {
    question: 'Are you saying the current political system is completely ineffective?',
    summary: 'Absoluut niet; parlementairen, commissies, regeringen, kabinetten en administraties leveren ontzettend goed werk. Maar op vlak van ecologisch beleid schieten ze erg tekort.',
    answer: 'A lot of the work being done by parliaments, administrations and cabinets is of extremely high quality and we are fully aware of the complexity of many societal issues. But in the long run, we hope to get rid of the populist, polarizing, paralyzing layer that party politics adds on top of it, and instead replace them with randomly selected citizens working together constructively.',
    tags: ['Politiek', 'Ideologie'],
    slug: 'huidig-systeem-ineffectief',
  },
]

export class Question {
  question: string;
  summary: string;
  answer?: string;
  slug: string;
  tags: string[];
}
