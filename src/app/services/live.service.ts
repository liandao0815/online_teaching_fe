import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import LiveRoom from 'class/live-room';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'environments/environment';
import { NzNotificationService } from 'ng-zorro-antd';
import { RequestParamOfTable } from 'config/table-config';

export interface LiveMessage {
  name: string;
  value: string;
}

export const INIT_LIVE_MESSAGE: LiveMessage = {
  name: '@@_INIT_LIVE_MESSAGE_NAME',
  value: '@@_INIT_LIVE_MESSAGE_VALUE'
};

@Injectable({ providedIn: 'root' })
export class LiveService {
  private webSocket: Subject<string>;

  message$: BehaviorSubject<LiveMessage> = new BehaviorSubject(INIT_LIVE_MESSAGE);
  liveRoom$: BehaviorSubject<LiveRoom> = new BehaviorSubject(new LiveRoom());

  constructor(private http: HttpClient, private notification: NzNotificationService) {
    this.getLiveRoom();
  }

  /**
   * @description 连接并初始化 webSocket
   * @param roomId 房间id
   * @param userId 用户id
   */
  connectWebSocket(roomId: number, userId: number): void {
    this.webSocket = webSocket(`${environment.webSocketUrlPrefix}/${roomId}/${userId}`);
    this.webSocket.subscribe(
      message => this.message$.next(JSON.parse(message)),
      error => this.notification.error('WebSocket错误', error)
    );
  }

  /**
   * @description 推送直播间信息
   * @param liveMessage 直播间信息
   */
  pushMessage(liveMessage: LiveMessage): void {
    this.webSocket.next(JSON.stringify(liveMessage));
  }

  /**
   * @description 根据用户id获取直播间
   */
  getLiveRoom(): void {
    this.http.get('/liveRoom').subscribe((res: ResponseData<LiveRoom>) => {
      if (res.code === SUCCESS_CODE) {
        this.liveRoom$.next(res.data);
      }
    });
  }

  /**
   * @description 申请开通直播间
   */
  createLiveRoom(params: FormData): Observable<any> {
    return this.http.post('/liveRoom', params);
  }

  /**
   * @description 修改直播间
   */
  updateLiveRoom(params: FormData): Observable<any> {
    return this.http.patch('/liveRoom', params);
  }

  /**
   * @description 获取正在直播的直播间列表
   */
  getLiveRoomListWithLiving(params: RequestParamOfTable): Observable<any> {
    return this.http.get('/liveRoom/list', { params });
  }

  /**
   * @description 获取直播间详情
   */
  getLiveRoomDetail(id: number): Observable<any> {
    return this.http.get(`/liveRoom/${id}`);
  }

  /**
   * @description 获取直播间列表
   */
  getLiveRoomList(params: RequestParamOfTable): Observable<any> {
    return this.http.get('/admin/liveRoom/list', { params });
  }

  /**
   * @description 更新直播间状态
   */
  updateLiveRoomStatus(params: any): Observable<any> {
    return this.http.patch('/admin/liveRoom/status', params);
  }

  /**
   * @description 管理员获取直播间详情
   */
  getLiveRoomByAdmin(id: number): Observable<any> {
    return this.http.get(`/admin/liveRoom/${id}`);
  }
}
