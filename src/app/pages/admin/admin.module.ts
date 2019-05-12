import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { AdminRoutingModule } from 'pages/admin/admin-routing.module';

import { AdminComponent } from './admin.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { LiveManageComponent } from './live-manage/live-manage.component';
import { NoteManageComponent } from './note-manage/note-manage.component';
import { CategoryManageComponent } from './category-manage/category-manage.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { AboutWebsiteComponent } from './about-website/about-website.component';

import { HeaderComponent, MenuComponent, TitleComponent } from 'components/admin';

const declarations = [
  AdminComponent,
  SignInComponent,
  HomePageComponent,
  UserManageComponent,
  CourseManageComponent,
  LiveManageComponent,
  NoteManageComponent,
  CategoryManageComponent,
  EditInfoComponent,
  AboutWebsiteComponent,
  HeaderComponent,
  MenuComponent,
  TitleComponent
];

const imports = [
  CommonModule,
  AdminRoutingModule,
  NgZorroAntdModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  NgxEchartsModule
];

@NgModule({
  declarations: [...declarations],
  imports: [...imports]
})
export class AdminModule {}
