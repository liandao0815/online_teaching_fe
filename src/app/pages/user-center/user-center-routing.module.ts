import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCenterComponent } from './user-center.component';
import { MyMessageComponent } from './my-message/my-message.component';
import { MyCourseComponent } from './my-course/my-course.component';
import { MyNoteComponent } from './my-note/my-note.component';
import { MyCollectionComponent } from './my-collection/my-collection.component';
import { MyQuestionComponent } from './my-question/my-question.component';
import { IndexAuthGuard } from 'guard/index-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserCenterComponent,
    canActivate: [IndexAuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [IndexAuthGuard],
        children: [
          { path: 'my_message', component: MyMessageComponent },
          { path: 'my_course', component: MyCourseComponent },
          { path: 'my_note', component: MyNoteComponent },
          { path: 'my_collection', component: MyCollectionComponent },
          { path: 'my_question', component: MyQuestionComponent },
          { path: '', redirectTo: '/user/my_message', pathMatch: 'full' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserCenterRoutingModule {}
