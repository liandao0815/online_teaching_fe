import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'services/category.service';
import Problem from 'class/problem';
import { BehaviorSubject } from 'rxjs';
import Category from 'class/category';
import { ProblemService } from 'services/problem.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {
  submitProblemModalStatus = false;

  problemList: Problem[] = [];
  problemForm = new Problem();
  pageNum = 1;
  pageSize = 10;
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private problemService: ProblemService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getProblemList();
  }

  get categoryList$(): BehaviorSubject<Category[]> {
    return this.categoryService.categoryList$;
  }

  toggleModalStatus(): void {
    this.submitProblemModalStatus = !this.submitProblemModalStatus;
  }

  trackByProblemList(index: number, problem: Problem) {
    return problem.id;
  }

  getProblemList(): void {
    const params = { pageNum: this.pageNum, pageSize: this.pageSize };

    this.loading = true;
    this.problemService.getProblemList(params).subscribe((res: ResponseData<Problem[]>) => {
      this.loading = false;

      if (res.code === SUCCESS_CODE) {
        this.pageNum += 1;
        this.problemList = [...this.problemList, ...res.data];
      }
    });
  }

  /**
   * @description 提交问题
   */
  handleSubmitProblemForm(): void {
    const messageId = this.message.loading('正在提交', { nzDuration: 0 }).messageId;

    this.problemService.submitProblem(this.problemForm).subscribe((res: ResponseData<any>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.message.success('提交成功');
        this.problemForm = new Problem();
        this.toggleModalStatus();

        this.pageNum = 1;
        this.problemList = [];
        this.getProblemList();
      }
    });
  }

  checkProblemFormStatus(): boolean {
    const { title, categoryId, content } = this.problemForm;

    return [title, categoryId, content].every(item => !!item);
  }
}
