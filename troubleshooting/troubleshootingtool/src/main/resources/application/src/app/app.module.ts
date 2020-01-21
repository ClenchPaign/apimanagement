import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

import { HttpClientModule } from '@angular/common/http';
import {ListingService} from './listing.service';
import { MessageService } from './message.service';
import { ListOfCategoriesComponent } from './list-of-categories/list-of-categories.component';
import { CategoryOfQuestionsComponent } from './category-of-questions/category-of-questions.component';


@NgModule({
  declarations: [
    AppComponent,
    ListOfCategoriesComponent,
    CategoryOfQuestionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule
  ],
  providers: [ListingService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
