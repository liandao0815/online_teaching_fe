import { Injectable } from '@angular/core';
import Category from 'class/category';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  categoryList$: BehaviorSubject<Category[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
    this.getCategoryList();
  }

  /**
   * @description 获取分类列表
   */
  getCategoryList(): void {
    this.http.get('/category/list').subscribe((res: ResponseData<Category[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.categoryList$.next(res.data);
      }
    });
  }

  /**
   * @description 添加分类
   */
  addCategory(params: Category): Observable<any> {
    return this.http.post('/admin/category', params);
  }

  /**
   * @description 删除分类
   */
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`/admin/category/${id}`);
  }

  /**
   * @description 更新分类
   */
  updateCategory(id: number, params: Category): Observable<any> {
    return this.http.patch(`/admin/category/${id}`, params);
  }
}
