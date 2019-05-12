import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EUserRole, UserService } from 'services/user.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import User from 'class/User';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signInForm = this.fb.group({
      account: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    const account = this.signInForm.get('account').value;
    const password = this.signInForm.get('password').value;
    const role = EUserRole.admin;

    const messageId = this.message.loading('正在登录', { nzDuration: 0 }).messageId;

    this.userService.login({ account, password, role }).subscribe((res: ResponseData<User>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.userService.saveUserInfo(res.data);
        this.message.success('登录成功');
        this.router.navigateByUrl('/admin');
      }
    });
  }
}
