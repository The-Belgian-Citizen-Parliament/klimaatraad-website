import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { MailComponent } from './mail/mail.component';
import { FaqComponent } from './faq/faq.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { environment } from 'src/environments/environment';

const routes: Routes = environment.language === 'nl' ? [
  { path: '', component: MainComponent },
  { path: 'memorandum', component: MemorandumComponent },
  { path: 'deelnemen', component: MailComponent },
  { path: 'vraag', component: FaqComponent },
] : [
  { path: '', component: MainComponent },
  { path: 'memorandum', component: MemorandumComponent },
  { path: 'participer', component: MailComponent },
  { path: 'question', component: FaqComponent },
  { path: 'deelnemen', redirectTo: 'participer' },
  { path: 'vraag', redirectTo: 'question' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    anchorScrolling: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
