import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guard/admin-auth.guard';

import { AdminComponent } from './admin.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { CategoryManageComponent } from './category-manage/category-manage.component';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { LiveManageComponent } from './live-manage/live-manage.component';
import { NoteManageComponent } from './note-manage/note-manage.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { AboutWebsiteComponent } from './about-website/about-website.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminAuthGuard],
        children: [
          { path: 'home_page', component: HomePageComponent },
          { path: 'user_manage', component: UserManageComponent },
          { path: 'category_manage', component: CategoryManageComponent },
          { path: 'course_manage', component: CourseManageComponent },
          { path: 'live_manage', component: LiveManageComponent },
          { path: 'note_manage', component: NoteManageComponent },
          { path: 'edit_info', component: EditInfoComponent },
          { path: 'about_website', component: AboutWebsiteComponent },
          { path: '', redirectTo: '/admin/home_page', pathMatch: 'full' }
        ]
      }
    ]
  },
  { path: 'sign_in', component: SignInComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
