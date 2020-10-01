import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MailComponent } from './mail/mail.component';
import { MailService } from './mail/mail.service';
import { MainComponent } from './main/main.component';
import { FaqComponent } from './faq/faq.component';
import { QuestionsService } from './questions/questions.service';
import { QuestionComponent } from './questions/question/question.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { MpComponent } from './mail/mp/mp.component';
import { QuestionDetailComponent } from './faq/question-detail/question-detail.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SvgLogosComponent } from './svg/svg-logos.component';
import { SeoService } from './seo.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MailComponent,
    FaqComponent,
    QuestionComponent,
    MemorandumComponent,
    MpComponent,
    QuestionDetailComponent,
    PrivacyComponent,
    SvgLogosComponent,
  ],
  imports: [
    TranslateModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  providers: [
    MailService,
    QuestionsService,
    Title,
    SeoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
