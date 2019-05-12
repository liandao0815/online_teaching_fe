import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { UserService, EUserRole } from 'services/user.service';
import User from 'class/User';
import { take, switchMap, catchError } from 'rxjs/operators';
import { ResponseData } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({ providedIn: 'root' })
export class IndexAuthGuard implements CanActivate, CanActivateChild {
  private messageId: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private message: NzMessageService
  ) {}

  canActivate(): Observable<boolean> | boolean {
    if (this.userService.userLogin) {
      return true;
    }

    this.messageId = this.message.loading('正在载入页面信息', { nzDuration: 0 }).messageId;

    return this.userService.loadUserInfo().pipe(
      take(1),
      switchMap(this.loadUserInfo),
      catchError(() => {
        this.message.remove(this.messageId);
        this.router.navigateByUrl('/login');
        return throwError('获取用户信息错误');
      })
    );
  }

  canActivateChild(): boolean {
    return this.userService.userLogin;
  }

  private loadUserInfo = (res: ResponseData<User>): Observable<boolean> => {
    this.message.remove(this.messageId);

    if (res.data && res.data.role !== EUserRole.admin) {
      this.userService.setLoginStatus(res.data.role, true);
      this.userService.userInfo$.next(res.data);
      return of(true);
    } else {
      this.router.navigateByUrl('/login');
      return of(false);
    }
  }
}
