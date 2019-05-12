import { Component, OnInit } from '@angular/core';
import Problem from 'class/problem';
import { ProblemService } from 'services/problem.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-my-question',
  template: `
    <app-user-center-abbr-info abbrTitle="我的提问" [abbrData]="problemList" urlPrefix="/question_detail">
    </app-user-center-abbr-info>
  `
})
export class MyQuestionComponent implements OnInit {
  problemList: Problem[] = [];

  constructor(private problemService: ProblemService) {}

  ngOnInit() {
    this.problemService.getProblemListByUser().subscribe((res: ResponseData<Problem[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.problemList = res.data;
      }
    });
  }
}
