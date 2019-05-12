import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu, userCenterMenu } from 'config/menu-config';
import { UserService } from 'services/user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-user-center-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUrl: string;
  menuConfig: Menu[] = userCenterMenu;
  modifyPswModalStatus = false;
  // 修改密码表单
  passwordForm = { oldPassword: '', newPassword: '' };

  constructor(
    private router: Router,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
  }

  handleClickMenu(url: string): void {
    this.currentUrl = url;
    this.router.navigateByUrl(url);
  }

  toggleModalStatus(): void {
    this.modifyPswModalStatus = !this.modifyPswModalStatus;
  }

  handleUpdatePassword(): void {
    const { oldPassword, newPassword } = this.passwordForm;

    if (oldPassword === newPassword) {
      this.message.warning('两次输入密码不能一致，请重新输入');
      return;
    }

    this.userService.updatePassword(oldPassword, newPassword).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('修改成功');
        this.passwordForm = { oldPassword: '', newPassword: '' };
        this.toggleModalStatus();
      } else {
        this.passwordForm = { oldPassword: '', newPassword: '' };
      }
    });
  }

  logout(): void {
    this.userService.logout();
  }
}
