import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import Comment from 'class/comment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  /**
   * @description 评论笔记
   */
  commentNote(params: Comment): Observable<any> {
    return this.http.post('/comment', params);
  }

  /**
   * @description 获取笔记评论列表
   */
  getCommentList(noteId: number): Observable<any> {
    return this.http.get('/comment/list', {
      params: new HttpParams().set('noteId', String(noteId))
    });
  }
}
