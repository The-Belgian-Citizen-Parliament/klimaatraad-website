import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { I18nServerModule } from './i18n.server.module';

@NgModule({
  imports: [
    I18nServerModule,
    AppModule,
    ServerModule,
    FlexLayoutServerModule,
    ServerTransferStateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
