import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MailComponent,
    FaqComponent,
    QuestionComponent,
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
    FlexLayoutModule,
    MatIconModule,
  ],
  providers: [
    MailService,
    QuestionsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
