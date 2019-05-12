import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProblemService } from 'services/problem.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import Problem from 'class/problem';
import Reply from 'class/reply';
import { ReplyService } from 'services/reply.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from 'services/user.service';
import User from 'class/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  private subscirption = new Subscription();

  replyContent: string;
  problemId: number;
  problemDetail: Problem;
  replyList: Reply[];
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private replyService: ReplyService,
    private message: NzMessageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const routeSub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const id = Number(paramMap.get('id'));
      this.problemId = id;
      this.getProblemDetail(id);
      this.getProblemReply(id);
    });
    const userSub = this.userService.userInfo$.subscribe((userInfo: User) => {
      this.userId = userInfo.id;
    });

    this.subscirption.add(routeSub);
    this.subscirption.add(userSub);
  }

  ngOnDestroy() {
    this.problemDetail = null;
    this.replyList = [];
    this.subscirption.unsubscribe();
  }

  /**
   * @description 获取问题详情
   */
  getProblemDetail(id: number): void {
    this.problemService.getProblemDetail(id).subscribe((res: ResponseData<Problem>) => {
      if (res.code === SUCCESS_CODE) {
        this.problemDetail = res.data;
      }
    });
  }

  /**
   * @description 获取问题回答列表
   */
  getProblemReply(problemId: number): void {
    this.replyService.getReplyList(problemId).subscribe((res: ResponseData<Reply[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.replyList = this.moveRecevieReplyToFirst(res.data);
      }
    });
  }

  /**
   * @description 回答问题
   */
  handleSubmitReply(): void {
    if (!this.replyContent) {
      this.message.warning('回答内容不能为空');
      return;
    }

    const reply = new Reply();
    reply.problemId = this.problemId;
    reply.content = this.replyContent;

    this.replyService.submitReply(reply).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('回答成功');
        this.replyContent = '';
        this.getProblemReply(this.problemId);
      }
    });
  }

  /**
   * @description 采纳答案
   */
  handleReceviedReply(replyId: number): void {
    const reply = new Reply();
    reply.problemId = this.problemId;

    this.replyService.receviedReply(replyId, reply).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('采纳成功');
        this.getProblemDetail(this.problemId);
        this.getProblemReply(this.problemId);
      }
    });
  }

  /**
   * @description 将采纳的答案移至数组首位
   */
  private moveRecevieReplyToFirst(array: Reply[]): Reply[] {
    const retArray: Reply[] = [];

    array.forEach(reply => {
      reply.status === '1' ? retArray.unshift(reply) : retArray.push(reply);
    });

    return retArray;
  }
}
