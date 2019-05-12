import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Note from 'class/note';
import { Observable } from 'rxjs';
import { RequestParamOfTable } from 'config/table-config';

export class NoteWithCollect extends Note {
  author?: string;
  collectId?: number;
}

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private http: HttpClient) {}

  /**
   * @description 提交笔记
   */
  createNote(params: Note): Observable<any> {
    return this.http.post('/note', params);
  }

  /**
   * @description 获取带有用户收藏信息的笔记列表
   */
  getNoteListWithCollect(params: any): Observable<any> {
    return this.http.get('/note/listWithCollect', { params });
  }

  /**
   * @description 获取笔记详情
   */
  getNoteDetail(noteId: number): Observable<any> {
    return this.http.get(`/note/${noteId}`);
  }

  /**
   * @description 获取当前用户笔记列表
   */
  getNoteListByUser(): Observable<any> {
    return this.http.get('/note/listByUser');
  }

  /**
   * @description 获取用户笔记列表
   */
  getNoteList(params: RequestParamOfTable): Observable<any> {
    return this.http.get('/admin/note/list', { params });
  }

  /**
   * @description 删除笔记
   */
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`/admin/note/${id}`);
  }
}
