import { Component, Input } from '@angular/core';
import Problem from 'class/problem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent {
  @Input() problem: Problem;

  constructor(private router: Router) {}

  gotoQuestionDetail(id: number): void {
    this.router.navigateByUrl(`/question_detail/${id}`);
  }
}
