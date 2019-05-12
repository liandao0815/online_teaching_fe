import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import Message from 'class/message';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messageList$: BehaviorSubject<Message[]> = new BehaviorSubject([]);
  hasRemind = false; // 是否有提醒过用户消息未读

  constructor(private http: HttpClient) {
    this.getMessageList();
  }

  /**
   * @description 获取消息列表
   */
  getMessageList(): void {
    this.http.get('/message/list').subscribe((res: ResponseData<Message[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.messageList$.next(res.data);
      }
    });
  }

  /**
   * @description 获取消息详情
   */
  getMessageDetail(id: number): Observable<any> {
    return this.http.get(`/message/${id}`);
  }
}
