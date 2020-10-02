import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { MailComponent } from './mail/mail.component';
import { FaqComponent } from './faq/faq.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { environment } from 'src/environments/environment';
import { QuestionDetailComponent } from './faq/question-detail/question-detail.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = environment.language === 'nl' ? [
  { path: '', component: MainComponent },
  { path: 'memorandum', redirectTo: 'voorstel' },
  { path: 'voorstel', component: MemorandumComponent, data: { 'title': 'The proposal' } },
  { path: 'deelnemen', component: MailComponent, data: { 'title': 'Take part' } },
  { path: 'faq', component: FaqComponent, data: { 'title': 'FAQ' } },
  { path: 'over', component: AboutComponent, data: { 'title': 'About us' } },
  { path: 'privacy', component: PrivacyComponent, data: { 'title': 'Privacy Statement' } },
  { path: 'vraag/:questionSlug', component: QuestionDetailComponent },
] : [
  { path: '', component: MainComponent },
  { path: 'memorandum', redirectTo: 'proposition' },
  { path: 'proposition', component: MemorandumComponent, data: { 'title': 'The proposal' } },
  { path: 'participer', component: MailComponent, data: { 'title': 'Take part' } },
  { path: 'faq', component: FaqComponent, data: { 'title': 'FAQ' } },
  { path: 'apropos', component: AboutComponent, data: { 'title': 'About us' } },
  { path: 'privacy', component: PrivacyComponent, data: { 'title': 'Privacy Statement' } },
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
