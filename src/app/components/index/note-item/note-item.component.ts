import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CollectService } from 'services/collect.service';
import Collect from 'class/collect';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';
import { switchMap } from 'rxjs/operators';
import { NoteWithCollect } from 'services/note.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.scss']
})
export class NoteItemComponent {
  @Input() noteWithCollect: NoteWithCollect;
  @Output() collectChange = new EventEmitter<number>();

  constructor(
    private collectService: CollectService,
    private message: NzMessageService,
    private router: Router
  ) {}

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
          this.collectChange.emit(res.data.id);
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
        this.collectChange.emit(null);
      }
    });
  }

  gotoNoteDetail(noteId: number): void {
    this.router.navigateByUrl(`/note_detail/${noteId}`);
  }
}
