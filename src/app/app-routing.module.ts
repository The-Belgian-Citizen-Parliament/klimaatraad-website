import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { MailComponent } from './mail/mail.component';
import { FaqComponent } from './faq/faq.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { environment } from 'src/environments/environment';
import { QuestionDetailComponent } from './faq/question-detail/question-detail.component';

const routes: Routes = environment.language === 'nl' ? [
  { path: '', component: MainComponent },
  { path: 'memorandum', redirectTo: 'voorstel' },
  { path: 'voorstel', component: MemorandumComponent },
  { path: 'deelnemen', component: MailComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'vraag/:questionSlug', component: QuestionDetailComponent },
] : [
  { path: '', component: MainComponent },
  { path: 'memorandum', redirectTo: 'proposition' },
  { path: 'proposition', component: MemorandumComponent },
  { path: 'participer', component: MailComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'deelnemen', redirectTo: 'participer' },
  { path: 'question/:questionSlug', component: QuestionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    anchorScrolling: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
