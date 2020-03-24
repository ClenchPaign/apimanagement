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
import { AddQuestionDialogComponent } from './add-question-dialog/add-question-dialog.component';
import { ReviewQuestionsComponent } from './review-questions/review-questions.component';
import { ApprovalStageComponent } from './approval-stage/approval-stage.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { AdministrationComponent } from './administration/administration.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuard], children: [
      {
        path: 'dashboard', component: DashboardComponent, children: [
          { path: 'search/:tag/:keyword', component: QuestionsListComponent }
        ]
      },
      {
        path: 'administration', component: AdministrationComponent, children: [
          { path: 'manage/:type', component: ManageComponent }
        ]
      },
      { path: 'review', component: ReviewQuestionsComponent },
      { path: 'add_qna', component: AddQaEntryComponent },
      { path: 'add_q', component: AddQuestionDialogComponent },
      { path: 'approval/:id', component: ApprovalStageComponent },
      { path: 'qna/:index/:id', component: QuestionDetailsComponent },
      {
        path: 'home', component: HomeComponent, children: [
          { path: 'category', component: ListOfCategoriesComponent },
          { path: 'category/:category/:from/:size', component: CategoryOfQuestionsComponent },
          { path: 'search/list', component: QuestionsListComponent },
          { path: 'search', component: SearchComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
