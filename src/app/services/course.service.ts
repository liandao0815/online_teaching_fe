import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ResponseData } from 'config/http-config';
import { RequestParamOfTable } from 'config/table-config';
import Course from 'class/course';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpClient) {}

  /**
   * @description 上传课程视频到七牛云
   */
  uploadCourse(params: FormData): Observable<any> {
    return this.getUpToken().pipe(
      switchMap((res: ResponseData<any>) => {
        params.append('token', res.data);
        const request = new HttpRequest('POST', 'https://upload.qiniup.com', params, {
          reportProgress: true
        });
        return this.http.request(request);
      })
    );
  }

  /**
   * @description 创建课程
   */
  createCourse(params: FormData): Observable<any> {
    return this.http.post('/course', params);
  }

  /**
   * @description 获取课程列表
   */
  getCourseList(params: RequestParamOfTable): Observable<any> {
    return this.http.get('/course/list', { params });
  }

  /**
   * @description 获取课程详情
   */
  getCourseDetail(id: number): Observable<any> {
    return this.http.get(`/course/${id}`);
  }

  /**
   * @description 获取当前用户课程列表
   */
  getCourseListByUser(): Observable<any> {
    return this.http.get('/course/listByUser');
  }

  /**
   * @description 删除课程
   */
  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`/admin/course/${id}`);
  }

  /**
   * @description 更新课程状态
   */
  updateCourseStatus(id: number, params: Course): Observable<any> {
    return this.http.patch(`/admin/course/${id}`, params);
  }

  /**
   * @description 获取课程上传凭证
   */
  private getUpToken(): Observable<any> {
    return this.http.get('/course/token');
  }
}
