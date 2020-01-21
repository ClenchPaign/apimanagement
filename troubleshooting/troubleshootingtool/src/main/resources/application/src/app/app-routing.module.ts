import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfCategoriesComponent } from './list-of-categories/list-of-categories.component';
import { CategoryOfQuestionsComponent } from './category-of-questions/category-of-questions.component';


const routes: Routes = [
  { path: '', component: ListOfCategoriesComponent},
  { path: 'list', component: ListOfCategoriesComponent },
  { path: 'cat', component: CategoryOfQuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
