import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexAuthGuard } from 'guard/index-auth.guard';

import { IndexComponent } from './index.component';
import { HomeComponent } from './home/home.component';
import { CourseComponent } from './course/course.component';
import { LiveComponent } from './live/live.component';
import { SolutionComponent } from './solution/solution.component';
import { NoteComponent } from './note/note.component';
import { LiveRoomComponent } from './live-room/live-room.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { EditLiveComponent } from './edit-live/edit-live.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [IndexAuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [IndexAuthGuard],
        children: [
          { path: 'home', component: HomeComponent },
          { path: 'live', component: LiveComponent },
          { path: 'course', component: CourseComponent },
          { path: 'solution', component: SolutionComponent },
          { path: 'note', component: NoteComponent },
          { path: 'live_room/:id', component: LiveRoomComponent },
          { path: 'course_detail/:id', component: CourseDetailComponent },
          { path: 'question_detail/:id', component: QuestionDetailComponent },
          { path: 'note_detail/:id', component: NoteDetailComponent },
          { path: 'edit_live', component: EditLiveComponent },
          { path: '', redirectTo: '/home', pathMatch: 'full' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule {}
