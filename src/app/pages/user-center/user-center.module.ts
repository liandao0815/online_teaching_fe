import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { UserCenterRoutingModule } from './user-center-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { PipeModule } from 'pipes/pipe.module';

import { UserCenterComponent } from './user-center.component';
import { FormsModule } from '@angular/forms';
import { MyMessageComponent } from './my-message/my-message.component';
import { MyCourseComponent } from './my-course/my-course.component';
import { MyNoteComponent } from './my-note/my-note.component';
import { MyQuestionComponent } from './my-question/my-question.component';
import { MyCollectionComponent } from './my-collection/my-collection.component';

import { HeaderComponent, AbbrInfoComponent } from 'components/user-center/index';

const declarations = [
  UserCenterComponent,
  MyMessageComponent,
  MyCourseComponent,
  MyNoteComponent,
  MyQuestionComponent,
  MyCollectionComponent,
  HeaderComponent,
  AbbrInfoComponent
];

const imports = [
  CommonModule,
  UserCenterRoutingModule,
  NgZorroAntdModule,
  FormsModule,
  InfiniteScrollModule,
  HttpClientModule,
  PipeModule
];

@NgModule({
  declarations: [...declarations],
  imports: [...imports]
})
export class UserCenterModule {}
