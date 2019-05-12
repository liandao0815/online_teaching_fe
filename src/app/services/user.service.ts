import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import User from 'class/User';
import { NzModalService } from 'ng-zorro-antd';
import { RequestParamOfTable } from 'config/table-config';

// 用户角色
export enum EUserRole {
  student = 'STUDENT',
  teacher = 'TEACHER',
  admin = 'ADMIN'
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // 初始化用户信息
  private initUserInfo: User = new User();

  userLogin = false; // 普通用户登录状态
  adminLogin = false; // 管理员登录状态
  userInfo$: BehaviorSubject<User> = new BehaviorSubject(this.initUserInfo);

  constructor(private http: HttpClient, private modalService: NzModalService) {}

  /**
   * @description 用户登录
   */
  login(params: User): Observable<any> {
    return this.http.post('/login', params);
  }

  /**
   * @description 退出登录
   * @param isAdmin 是否为管理员用户
   */
  logout(): void {
    this.modalService.info({
      nzTitle: '确定要退出登录吗？',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.userLogin = false;
        this.adminLogin = false;

        window.localStorage.setItem('token', '');
        window.localStorage.setItem('uid', '');

        setTimeout(() => window.location.reload(), 300);
      }
    });
  }

  /**
   * @description 加载用户信息
   */
  loadUserInfo(): Observable<any> {
    return this.http.get('/user');
  }

  /**
   * @description 保存用户信息
   */
  saveUserInfo(userInfo: User): void {
    const { id, token, role } = userInfo;

    window.localStorage.setItem('token', `Bearer ${token}`);
    window.localStorage.setItem('uid', id.toString());

    this.userInfo$.next(userInfo);
    this.setLoginStatus(role, true);
  }

  /**
   * @description 设置用户登录状态
   * @param role 用户角色
   * @param status 登录状态
   */
  setLoginStatus(role: string, status: boolean): void {
    if (role === EUserRole.admin) {
      this.adminLogin = status;
      this.userLogin = !status;
    } else {
      this.userLogin = status;
      this.adminLogin = !status;
    }
  }

  /**
   * @description 单个添加用户
   */
  addUser(params: FormData): Observable<any> {
    return this.http.post('/admin/user', params);
  }

  /**
   * @description 批量添加用户
   */
  batchAddUser(params: FormData): Observable<any> {
    return this.http.post('/admin/user/batch', params);
  }

  /**
   * @description 获取用户列表
   */
  getUserList(params: RequestParamOfTable): Observable<any> {
    return this.http.get('/admin/user/list', { params });
  }

  /**
   * @description 根据用户id查找用户信息
   */
  getUserById(id: number): Observable<any> {
    return this.http.get(`/admin/user/${id}`);
  }

  /**
   * @description 根据用户id更新用户信息
   */
  updateUserById(id: number, params: User): Observable<any> {
    return this.http.patch(`/admin/user/${id}`, params);
  }

  /**
   * @description 根据用户id删除用户
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`/admin/user/${id}`);
  }

  /**
   * @description 更新用户信息
   */
  updateUser(params: FormData): Observable<any> {
    return this.http.patch('/admin/user', params);
  }

  /**
   * @description 更新用户密码
   */
  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.patch('/user/password', { oldPassword, newPassword });
  }
}
