export class Mail {
  // tslint:disable-next-line: variable-name
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  city: string;

  allowPublic: boolean;
  allowReplies: boolean;
  stayUpToDate: boolean;

  to: string;
  subject: string;
  body: string;

  sentOn: Date;
}
