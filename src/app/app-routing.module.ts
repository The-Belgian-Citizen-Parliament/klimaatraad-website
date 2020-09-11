import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MailComponent } from './mail/mail.component';
import { FaqComponent } from './faq/faq.component';


const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'deelnemen', component: MailComponent },
  { path: 'vraag', component: FaqComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
