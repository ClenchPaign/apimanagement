import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';

import { HttpClientModule } from '@angular/common/http';
import {ListingService} from './listing.service';
import { MessageService } from './message.service';
import { ListOfCategoriesComponent } from './list-of-categories/list-of-categories.component';
import { CategoryOfQuestionsComponent } from './category-of-questions/category-of-questions.component';
import { SearchComponent } from './search/search.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ListOfCategoriesComponent,
    CategoryOfQuestionsComponent,
    SearchComponent,
    QuestionDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [ListingService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
