import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { I18nBrowserModule } from './i18n.browser.module';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    I18nBrowserModule,
    AppModule,
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }
