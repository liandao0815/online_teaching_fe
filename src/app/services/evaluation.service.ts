import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Evaluation from 'class/evaluation';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  constructor(private http: HttpClient) {}

  /**
   * @description 提交课程评价
   */
  submitCourseEvaluation(params: Evaluation): Observable<any> {
    return this.http.post('/evaluation', params);
  }

  /**
   * @description 获取课程评价列表
   */
  getEvaluationList(courseId: number): Observable<any> {
    return this.http.get('/evaluation/list', {
      params: new HttpParams().set('courseId', String(courseId))
    });
  }
}
