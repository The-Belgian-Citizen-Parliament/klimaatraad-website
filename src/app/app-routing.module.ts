import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { MailComponent } from './mail/mail.component';
import { FaqComponent } from './faq/faq.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { QuestionDetailComponent } from './faq/question-detail/question-detail.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'proposal', component: MemorandumComponent, data: { 'title': 'The proposal' } },
  { path: 'voorstel', component: MemorandumComponent, data: { 'title': 'The proposal' } },
  { path: 'proposition', component: MemorandumComponent, data: { 'title': 'The proposal' } },
  { path: 'participate', component: MailComponent, data: { 'title': 'Take part' } },
  { path: 'deelnemen', component: MailComponent, data: { 'title': 'Take part' } },
  { path: 'participer', component: MailComponent, data: { 'title': 'Take part' } },
  { path: 'faq', component: FaqComponent, data: { 'title': 'FAQ' } },
  { path: 'about', component: AboutComponent, data: { 'title': 'About us' } },
  { path: 'over', component: AboutComponent, data: { 'title': 'About us' } },
  { path: 'a-propos', component: AboutComponent, data: { 'title': 'About us' } },
  { path: 'question/:questionSlug', component: QuestionDetailComponent },
  { path: 'vraag/:questionSlug', component: QuestionDetailComponent },
  { path: 'privacy', component: PrivacyComponent, data: { 'title': 'Privacy Statement' } },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    anchorScrolling: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
