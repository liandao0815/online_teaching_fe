import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipeModule } from 'pipes/pipe.module';

import { IndexComponent } from './index.component';
import { HomeComponent } from './home/home.component';
import { CourseComponent } from './course/course.component';
import { LiveComponent } from './live/live.component';
import { NoteComponent } from './note/note.component';
import { SolutionComponent } from './solution/solution.component';
import { LiveRoomComponent } from './live-room/live-room.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { EditLiveComponent } from './edit-live/edit-live.component';

import * as components from 'components/index/index';

const declarations = [
  IndexComponent,
  HomeComponent,
  LiveComponent,
  CourseComponent,
  SolutionComponent,
  NoteComponent,
  LiveRoomComponent,
  NoteDetailComponent,
  CourseDetailComponent,
  QuestionDetailComponent,
  EditLiveComponent,
  components.BriefItemComponent,
  components.HeaderComponent,
  components.NoteItemComponent,
  components.QuestionItemComponent,
  components.VideoPlayerComponent,
  components.ChatRoomComponent,
  components.SearchComponent
];

const imports = [
  CommonModule,
  NgZorroAntdModule,
  IndexRoutingModule,
  FormsModule,
  QuillModule,
  HttpClientModule,
  InfiniteScrollModule,
  PipeModule
];

@NgModule({
  declarations: [...declarations],
  imports: [...imports]
})
export class IndexModule {}
