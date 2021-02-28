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
import { AboutComponent } from './about/about.component';
import { ParticipateComponent } from './participate/participate.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { TruncatePipe } from './common/truncate.pipe';
import { RandomImageService } from './common/random-image.service';
import { LanguageService } from './common/language.service';
import { InlineMailComponent } from './inlinemail/inlinemail.component';
import { LowercaseDirective } from './common/lowercase.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FaqComponent,
    QuestionComponent,
    MemorandumComponent,
    MpComponent,
    QuestionDetailComponent,
    PrivacyComponent,
    SvgLogosComponent,
    AboutComponent,
    ParticipateComponent,
    NotFoundComponent,
    TruncatePipe,
    InlineMailComponent,
    LowercaseDirective,
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
    RandomImageService,
    LanguageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
