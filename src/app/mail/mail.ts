export class Mail {
  // tslint:disable-next-line: variable-name
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  city: string;
  lang: string;

  allowPublic: boolean;
  allowReplies: boolean;
  stayUpToDate: boolean;

  to: string;
  subject: string;
  body: string;

  sentOn: Date;
}
