import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfCategoriesComponent } from './list-of-categories/list-of-categories.component';
import { CategoryOfQuestionsComponent } from './category-of-questions/category-of-questions.component';
import { SearchComponent } from './search/search.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { AddQaEntryComponent } from './add-qa-entry/add-qa-entry.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'main', component: MainComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'category', component: ListOfCategoriesComponent },
      { path: 'category/:category', component: CategoryOfQuestionsComponent },
      { path: 'qna/:id', component: QuestionDetailsComponent },
      { path: 'add_qna', component: AddQaEntryComponent },
      { path: 'search/:tag/:keyword', component: QuestionsListComponent },
      { path: 'search', component: SearchComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
