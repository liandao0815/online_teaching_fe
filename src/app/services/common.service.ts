import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private http: HttpClient) {}

  /**
   * @description 获取搜索数据
   */
  getSearchData = (value: string): Observable<any> => {
    return value
      ? this.http.get('/search', {
          params: new HttpParams().set('value', value)
        })
      : of({});
  }

  /**
   * @description 获取首页数据
   */
  getHomePageData(): Observable<any> {
    return this.http.get('/home');
  }

  /**
   * @description 获取后台管理首页数据
   */
  getAdminHomeData(): Observable<any> {
    return this.http.get('/admin/home');
  }
}
