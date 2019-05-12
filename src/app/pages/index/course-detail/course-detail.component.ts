import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService } from 'services/course.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import Course from 'class/course';
import Evaluation from 'class/evaluation';
import { EvaluationService } from 'services/evaluation.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  courseDetail: Course;
  courseId: number;
  evalutionModalStatus = false;
  evalutionForm: Evaluation = { score: 5, content: '' };
  evaluationList: Evaluation[] = [];
  evaluationAvgScore: number;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private evaluationService: EvaluationService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    const routeSub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const id = Number(paramMap.get('id'));
      this.courseId = id;
      this.getCourseDetail(id);
      this.getCourseEvaluationList(id);
    });

    this.subscription.add(routeSub);
  }

  ngOnDestroy() {
    this.courseDetail = null;
    this.evaluationList = [];
    this.subscription.unsubscribe();
  }

  /**
   * @description 获取课程详情
   */
  getCourseDetail(id: number): void {
    this.loading = true;
    this.courseService.getCourseDetail(id).subscribe((res: ResponseData<Course>) => {
      this.loading = false;
      if (res.code === SUCCESS_CODE) {
        this.courseDetail = res.data;
      }
    });
  }

  /**
   * @description 获取课程评价列表
   */
  getCourseEvaluationList(courseId: number): void {
    this.evaluationService.getEvaluationList(courseId).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.evaluationList = res.data.list;
        this.evaluationAvgScore = res.data.average;
      }
    });
  }

  /**
   * @description 提交课程评价
   */
  handleSubmitCourseEvaluation(): void {
    const params = { ...this.evalutionForm, courseId: this.courseId };

    this.evaluationService
      .submitCourseEvaluation(params)
      .subscribe((res: ResponseData<any>) => {
        if (res.code === SUCCESS_CODE) {
          this.evalutionForm = { score: 5, content: '' };
          this.message.success('评价成功');
          this.toggleModalStatus();
          this.getCourseEvaluationList(this.courseId);
        }
      });
  }

  toggleModalStatus(): void {
    this.evalutionModalStatus = !this.evalutionModalStatus;
  }
}
