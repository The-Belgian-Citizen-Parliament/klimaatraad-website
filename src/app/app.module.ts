import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MailComponent } from './mail/mail.component';
import { MailService } from './mail/mail.service';
import { MainComponent } from './main/main.component';
import { FaqComponent } from './faq/faq.component';
import { QuestionsService } from './questions/questions.service';
import { QuestionComponent } from './questions/question/question.component';
import { environment } from '../environments/environment';
import { WebpackTranslateLoader } from './webpack-translate-loader';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MailComponent,
    FaqComponent,
    QuestionComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TranslateModule.forRoot({
      defaultLanguage: environment.language,
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      },
    }),
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
