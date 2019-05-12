import { Component, OnInit } from '@angular/core';
import Course from 'class/course';
import { CourseService } from 'services/course.service';
import { TableInfo, RequestParamOfTable, ResponseDataOfTable } from 'config/table-config';
import { SUCCESS_CODE, ResponseData } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-admin-course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.scss']
})
export class CourseManageComponent implements OnInit {
  courseQueryForm = new Course();

  // 课程表格信息
  courseTableInfo: TableInfo<Course> = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    data: []
  };

  constructor(private courseService: CourseService, private message: NzMessageService) {}

  ngOnInit() {
    this.searchCourseData();
  }

  /**
   * @description 搜索课程列表
   * @param pageNo 页码数
   */
  searchCourseData(pageNo?: number): void {
    const { id, name, priority } = this.courseQueryForm;
    const { pageNum, pageSize } = this.courseTableInfo;
    const params: RequestParamOfTable = {
      pageNum: pageNo || pageNum,
      pageSize,
      id: id || 0,
      name: name || '',
      priority: priority || ''
    };

    this.courseTableInfo.pageNum = pageNo || pageNum;
    this.courseTableInfo.loading = true;

    this.courseService.getCourseList(params).subscribe((res: ResponseDataOfTable<Course>) => {
      this.courseTableInfo.loading = false;

      if (res.code === SUCCESS_CODE) {
        this.courseTableInfo.total = res.data.total;
        this.courseTableInfo.data = res.data.list;
      }
    });
  }

  /**
   * @description 更新课程状态
   */
  updateCourseStatus(id: number, priority: string): void {
    const course = new Course();

    priority = priority === '1' ? '0' : '1';
    course.priority = priority;

    this.courseService.updateCourseStatus(id, course).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('操作成功');
        this.searchCourseData(this.courseTableInfo.pageNum);
      }
    });
  }

  /**
   * @description 删除课程
   */
  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('删除成功');
        this.searchCourseData(1);
      }
    });
  }
}
