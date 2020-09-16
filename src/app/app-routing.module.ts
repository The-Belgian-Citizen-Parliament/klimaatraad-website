import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { MailComponent } from './mail/mail.component';
import { FaqComponent } from './faq/faq.component';
import { MemorandumComponent } from './memorandum/memorandum.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'memorandum', component: MemorandumComponent },
  { path: 'deelnemen', component: MailComponent },
  { path: 'vraag', component: FaqComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    anchorScrolling: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
