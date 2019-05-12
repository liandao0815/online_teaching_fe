import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './pages/not-found/not-found.component';

import { AdminAuthGuard } from 'src/app/guard/admin-auth.guard';
import { LoginComponent } from 'pages/login/login.component';
import { IndexAuthGuard } from 'guard/index-auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/index/index.module#IndexModule' },
  { path: 'user', loadChildren: './pages/user-center/user-center.module#UserCenterModule' },
  { path: 'admin', loadChildren: './pages/admin/admin.module#AdminModule' },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
