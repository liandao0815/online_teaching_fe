import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'services/user.service';
import { Subscription } from 'rxjs';
import User from 'class/User';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  userInfo: User;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userInfoSub = this.userService.userInfo$.subscribe((userInfo: User) => {
      this.userInfo = userInfo;
    });
    this.subscription.add(userInfoSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPeriod(): string {
    const currentHour = new Date().getHours();
    const timePeriod = [
      { hour: 5, value: '凌晨' },
      { hour: 8, value: '早晨' },
      { hour: 11, value: '上午' },
      { hour: 13, value: '中午' },
      { hour: 16, value: '下午' },
      { hour: 19, value: '傍晚' },
      { hour: 24, value: '晚上' }
    ];

    return timePeriod.find(item => currentHour <= item.hour).value;
  }

  logout(): void {
    this.userService.logout();
  }
}
