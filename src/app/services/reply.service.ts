import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Reply from 'class/reply';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReplyService {
  constructor(private http: HttpClient) {}

  /**
   * @description 提交问题回答
   */
  submitReply(params: Reply): Observable<any> {
    return this.http.post('/reply', params);
  }

  /**
   * @description 获取回答列表
   */
  getReplyList(problemId: number): Observable<any> {
    return this.http.get('/reply/list', {
      params: new HttpParams().set('problemId', String(problemId))
    });
  }

  /**
   * @description 采纳回答
   */
  receviedReply(id: number, params: Reply): Observable<any> {
    return this.http.patch(`/reply/status/${id}`, params);
  }
}
