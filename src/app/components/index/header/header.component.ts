import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Menu, indexMenu } from 'config/menu-config';
import User from 'class/User';
import { UserService, EUserRole } from 'services/user.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { LiveService } from 'services/live.service';
import LiveRoom from 'class/live-room';
import { environment } from 'environments/environment';
import { MessageService } from 'services/message.service';
import Message from 'class/message';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() menuId: number;

  private subscription = new Subscription();

  userInfo: User;
  currentUrl: string;
  menuConfig: Menu[] = indexMenu;
  launchLiveModalStatus = false;
  liveRoom: LiveRoom;
  rtmpUrlPrefix = environment.rtmpUrlPrefix;

  constructor(
    private router: Router,
    private userService: UserService,
    private liveService: LiveService,
    private notification: NzNotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects || event.url;
      });

    const userInfoSub = this.userService.userInfo$.subscribe((userInfo: User) => {
      this.userInfo = userInfo;
    });

    const liveRoomSub = this.liveService.liveRoom$.subscribe((liveRoom: LiveRoom) => {
      this.liveRoom = liveRoom;
    });

    const messageSub = this.messageService.messageList$.subscribe((messageList: Message[]) => {
      messageList.forEach(message => {
        if (message.status === '0' && !this.messageService.hasRemind) {
          this.notification.info('系统提醒', '您还有未读的个人消息，请前往个人中心查看');
          this.messageService.hasRemind = true;
          return;
        }
      });
    });

    this.subscription.add(routerSub);
    this.subscription.add(userInfoSub);
    this.subscription.add(liveRoomSub);
    this.subscription.add(messageSub);

    this.currentUrl = this.router.url;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleClickMenu(url: string): void {
    this.router.navigateByUrl(url);
  }

  toggleModalStatus(): void {
    this.launchLiveModalStatus = !this.launchLiveModalStatus;
  }

  /**
   * @description 处理点击开通直播按钮功能
   */
  handleClickLaunch(): void {
    if (this.userInfo.role !== EUserRole.teacher) {
      this.notification.warning('权限不足', '当前账号的角色不是教师，暂无开通直播权限');
      return;
    }

    if (this.liveRoom && this.liveRoom.status === '0') {
      this.notification.info('未审核', '您申请开通的直播间正在审核，请等待通知');
      return;
    }

    if (this.liveRoom && this.liveRoom.status === '2') {
      this.notification.warning('审核不通过', '直播间审核不通过，请重新提交审核');
      this.router.navigateByUrl('/edit_live');
      return;
    }

    if (this.liveRoom && this.liveRoom.status === '3') {
      this.notification.error('已冻结', '直播间已被冻结，无法继续直播');
      return;
    }

    this.toggleModalStatus();
  }

  gotoMyLiveRoomPage(): void {
    this.toggleModalStatus();
    this.router.navigateByUrl(`/live_room/${this.liveRoom.id}`);
  }

  gotoEditLivePage(): void {
    this.toggleModalStatus();
    this.router.navigateByUrl('/edit_live');
  }

  logout(): void {
    this.userService.logout();
  }
}
