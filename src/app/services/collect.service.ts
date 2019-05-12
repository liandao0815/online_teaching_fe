import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Collect from 'class/collect';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CollectService {
  constructor(private http: HttpClient) {}

  /**
   * @description 收藏笔记
   */
  collectNote(params: Collect): Observable<any> {
    return this.http.post('/collect', params);
  }

  /**
   * @description 获取笔记收藏信息
   */
  getCollectNote(noteId: number): Observable<any> {
    const collect = new Collect();
    collect.noteId = noteId;

    return this.http.get('/collect', { params: collect as HttpParams });
  }

  /**
   * @description 删除笔记收藏信息
   */
  deleteCollectNote(id: number): Observable<any> {
    return this.http.delete(`/collect/${id}`);
  }

  /**
   * @description 获取当前收藏列表
   */
  getCollectListByUser(): Observable<any> {
    return this.http.get('/collect/listByUser');
  }
}
