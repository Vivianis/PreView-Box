import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { PreviewComponent } from './preview/preview.component';
import { FileService } from './elements.service';
import { FilesListComponent } from './files-list/files-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    FilesListComponent
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
