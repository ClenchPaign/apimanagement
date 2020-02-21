import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

import { HttpClientModule } from '@angular/common/http';
import { ListingService } from './listing.service';
import { MessageService } from './message.service';
import { ListOfCategoriesComponent } from './list-of-categories/list-of-categories.component';
import { CategoryOfQuestionsComponent } from './category-of-questions/category-of-questions.component';
import { SearchComponent } from './search/search.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NgxFileDropModule } from 'ngx-file-drop';
import {MatMenuModule} from '@angular/material/menu';

import { AddQuestionDialogComponent } from './add-question-dialog/add-question-dialog.component';
import { AddQaEntryComponent } from './add-qa-entry/add-qa-entry.component';
import { FiltersComponent } from './filters/filters.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    ListOfCategoriesComponent,
    CategoryOfQuestionsComponent,
    SearchComponent,
    QuestionDetailsComponent,
    QuestionsListComponent,
    AddQuestionDialogComponent,
    AddQaEntryComponent,
    FiltersComponent,
    LoginComponent,
    FiltersComponent,
    DashboardComponent,
    MainComponent
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
    MatDialogModule,
    MatAutocompleteModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    TextFieldModule,
    ReactiveFormsModule,
    HttpClientModule,
    RichTextEditorAllModule,
    NgxFileDropModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRippleModule
  ],
  providers: [ListingService, MessageService],
  bootstrap: [AppComponent],
  entryComponents: [AddQuestionDialogComponent]
})
export class AppModule { }
