import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfCategoriesComponent } from './list-of-categories/list-of-categories.component';
import { CategoryOfQuestionsComponent } from './category-of-questions/category-of-questions.component';
import { SearchComponent } from './search/search.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';


const routes: Routes = [
  { path: '', component: ListOfCategoriesComponent},
  { path: 'categories', component: ListOfCategoriesComponent },
  { path: 'categories/:category', component: CategoryOfQuestionsComponent },
  { path: 'qnas/:id', component: QuestionDetailsComponent},
  { path: 'search/:keyword', component: QuestionsListComponent},
  { path: 'search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
