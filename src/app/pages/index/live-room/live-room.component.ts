import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LiveService } from 'services/live.service';
import { Subscription } from 'rxjs';
import { UserService } from 'services/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import LiveRoom from 'class/live-room';
import { combineLatest } from 'rxjs';
import User from 'class/User';
import { NzMessageService } from 'ng-zorro-antd';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-live-room',
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.scss']
})
export class LiveRoomComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  liveRoomDetail: LiveRoom;

  constructor(
    private sanitizer: DomSanitizer,
    private liveService: LiveService,
    private userService: UserService,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    const combined = combineLatest(this.userService.userInfo$, this.route.paramMap).subscribe(
      (source: [User, ParamMap]) => {
        const userId = source[0].id;
        const liveRoomId = Number(source[1].get('id'));

        this.getLiveRoomDetail(liveRoomId);
        this.liveService.connectWebSocket(userId, liveRoomId);
      }
    );
    this.subscription.add(combined);
  }

  ngOnDestroy() {
    this.liveRoomDetail = null;
    this.subscription.unsubscribe();
  }

  get videoSrc(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `${environment.rtmpUrlPrefix}/live/${this.liveRoomDetail.id}`
    );
  }

  getLiveRoomDetail(id: number): void {
    this.liveService.getLiveRoomDetail(id).subscribe((res: ResponseData<LiveRoom>) => {
      if (res.code === SUCCESS_CODE) {
        this.liveRoomDetail = res.data;
      }
    });
  }
}
