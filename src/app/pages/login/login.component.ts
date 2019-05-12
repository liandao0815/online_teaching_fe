import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'services/user.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';
import User from 'class/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userRole = 'STUDENT';
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      account: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    const account = this.loginForm.get('account').value;
    const password = this.loginForm.get('password').value;
    const role = this.userRole;

    const messageId = this.message.loading('正在登录', { nzDuration: 0 }).messageId;

    this.userService.login({ account, password, role }).subscribe((res: ResponseData<User>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.userService.saveUserInfo(res.data);
        this.message.success('登录成功');
        this.router.navigateByUrl('/');
      }
    });
  }
}
