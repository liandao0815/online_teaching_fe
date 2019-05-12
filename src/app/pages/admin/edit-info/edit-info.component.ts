import { Component, OnInit, OnDestroy } from '@angular/core';
import User from 'class/User';
import { UserService } from 'services/user.service';
import { Subscription } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss']
})
export class EditInfoComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  editForm = new User();
  avatarFile: File;
  password = '';

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    const userInfoSub = this.userService.userInfo$.subscribe((userInfo: User) => {
      this.editForm = { ...userInfo };
    });
    this.subscription.add(userInfoSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get avatarLocalUrl(): string | SafeUrl {
    return this.avatarFile
      ? this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.avatarFile))
      : this.editForm.avatar;
  }

  handleAvatarFileChange(file: File): void {
    if (file) {
      this.avatarFile = file;
    }
  }

  handleUpdateUserInfo(): void {
    const formData = new FormData();
    const { id, account, username } = this.editForm;

    if (!account || !username) {
      this.message.warning('用户账号或名称不能为空');
      return;
    }

    console.log(this.password);

    formData.append('id', id.toString());
    formData.append('account', account);
    formData.append('username', username);
    formData.append('password', this.password);
    formData.append('avatar', this.avatarFile);

    const messageId = this.message.loading('正在修改', { nzDuration: 0 }).messageId;
    this.userService.updateUser(formData).subscribe((res: ResponseData<any>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.message.success('修改成功');
        this.updateUserInfo();
        this.password = '';
      }
    });
  }

  private updateUserInfo(): void {
    this.userService.getUserById(this.editForm.id).subscribe((res: ResponseData<User>) => {
      if (res.code === SUCCESS_CODE) {
        this.userService.saveUserInfo(res.data);
      }
    });
  }
}
