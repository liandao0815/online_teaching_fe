import { Component, OnInit } from '@angular/core';
import Course from 'class/course';
import { CourseService } from 'services/course.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-my-course',
  template: `
    <app-user-center-abbr-info abbrTitle="我的课程" [abbrData]="courseList" urlPrefix="/course_detail">
    </app-user-center-abbr-info>
  `
})
export class MyCourseComponent implements OnInit {
  courseList: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourseListByUser().subscribe((res: ResponseData<Course[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.courseList = res.data;
      }
    });
  }
}
