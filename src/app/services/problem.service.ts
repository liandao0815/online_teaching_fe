import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Problem from 'class/problem';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProblemService {
  constructor(private http: HttpClient) {}

  /**
   * @description 提交问题
   */
  submitProblem(params: Problem): Observable<any> {
    return this.http.post('/problem', params);
  }

  /**
   * @description 获取问题列表
   */
  getProblemList(params: any): Observable<any> {
    return this.http.get('/problem/list', { params });
  }

  /**
   * @description 获取问题详情
   */
  getProblemDetail(id: number): Observable<any> {
    return this.http.get(`/problem/${id}`);
  }

  /**
   * @description 获取当前用户问题列表
   */
  getProblemListByUser(): Observable<any> {
    return this.http.get('/problem/listByUser');
  }
}
