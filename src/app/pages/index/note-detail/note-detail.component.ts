import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NoteWithCollect, NoteService } from 'services/note.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';
import Collect from 'class/collect';
import Comment from 'class/comment';
import { CollectService } from 'services/collect.service';
import { switchMap } from 'rxjs/operators';
import { CommentService } from 'services/comment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit, OnDestroy {
  private subscirption = new Subscription();

  noteDetail: NoteWithCollect;
  noteId: number;
  commentList: Comment[];
  commentContent: string;

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private noteService: NoteService,
    private collectService: CollectService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    const routeSub =  this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const id = Number(paramMap.get('id'));
      this.getNoteDetial(id);
      this.getNoteComment(id);
      this.noteId = id;
    });

    this.subscirption.add(routeSub);
  }

  ngOnDestroy() {
    this.noteDetail = null;
    this.commentList = [];
    this.subscirption.unsubscribe();
  }

  /**
   * @description 获取笔记详情
   */
  getNoteDetial(id: number): void {
    this.noteService.getNoteDetail(id).subscribe((res: ResponseData<NoteWithCollect>) => {
      if (res.code === SUCCESS_CODE) {
        this.noteDetail = res.data;
      }
    });
  }

  /**
   * @description 获取笔记评论
   */
  getNoteComment(noteId: number): void {
    this.commentService.getCommentList(noteId).subscribe((res: ResponseData<Comment[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.commentList = res.data;
      }
    });
  }

  /**
   * @description 收藏笔记
   */
  requestCollectNote(noteId: number): void {
    const collect = new Collect();
    collect.noteId = noteId;

    this.collectService
      .collectNote(collect)
      .pipe(
        switchMap((res: ResponseData<any>) => {
          if (res.code === SUCCESS_CODE) {
            return this.collectService.getCollectNote(noteId);
          }
        })
      )
      .subscribe((res: ResponseData<Collect>) => {
        if (res.code === SUCCESS_CODE) {
          this.message.success('收藏成功');
          this.noteDetail.collectId = res.data.id;
        }
      });
  }

  /**
   * @description 取消收藏笔记
   */
  cancelCollectNote(collectId: number): void {
    this.collectService.deleteCollectNote(collectId).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('取消收藏成功');
        this.noteDetail.collectId = null;
      }
    });
  }

  /**
   * @description 评论笔记
   */
  handleCommentNote(): void {
    if (!this.commentContent) {
      return;
    }

    const comment = new Comment();
    comment.noteId = this.noteId;
    comment.content = this.commentContent;

    this.commentService.commentNote(comment).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('评论成功');
        this.getNoteComment(this.noteId);
        this.commentContent = '';
      }
    });
  }
}
