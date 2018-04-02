import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { PreviewComponent } from './preview/preview.component';
import { FileService } from './elements.service';

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule
  ],
  providers: [
    FileService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
