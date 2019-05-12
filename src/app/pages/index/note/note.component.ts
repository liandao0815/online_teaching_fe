import { Component, OnInit } from '@angular/core';
import Note from 'class/note';
import { NoteService, NoteWithCollect } from 'services/note.service';
import { CategoryService } from 'services/category.service';
import { BehaviorSubject } from 'rxjs';
import Category from 'class/category';
import { NzMessageService } from 'ng-zorro-antd';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  // 富文本编辑器配置
  quillToolbar = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean']
    ]
  };

  writeNoteModalStatus = false;
  noteForm = new Note();
  noteTye = true;
  noteListWithCollect: NoteWithCollect[] = [];
  pageNum = 1;
  pageSize = 10;
  loading = false;

  constructor(
    private noteService: NoteService,
    private categoryService: CategoryService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getnNteListWithCollect();
  }

  get categoryList$(): BehaviorSubject<Category[]> {
    return this.categoryService.categoryList$;
  }

  getnNteListWithCollect(): void {
    const params = { pageNum: this.pageNum, pageSize: this.pageSize };

    this.loading = true;
    this.noteService
      .getNoteListWithCollect(params)
      .subscribe((res: ResponseData<NoteWithCollect[]>) => {
        this.loading = false;

        if (res.code === SUCCESS_CODE) {
          this.pageNum += 1;
          this.noteListWithCollect = [...this.noteListWithCollect, ...res.data];
        }
      });
  }

  toggleModalStatus(): void {
    this.writeNoteModalStatus = !this.writeNoteModalStatus;
  }

  trackByNoteLitstWithCollect(index: number, noteWithCollect: NoteWithCollect) {
    return noteWithCollect.id;
  }

  handleCollectChange(noteId: number, collectId: number): void {
    const targetId =  this.noteListWithCollect.findIndex(item => item.id === noteId);
    const newNote: NoteWithCollect = {...this.noteListWithCollect[targetId], collectId};

    this.noteListWithCollect[targetId] = newNote;
  }

  /**
   * @description 提交笔记
   */
  handleSubmitNoteForm(): void {
    this.noteForm.type = this.noteTye ? '1' : '0';

    const messageId = this.message.loading('正在提交', { nzDuration: 0 }).messageId;

    this.noteService.createNote(this.noteForm).subscribe((res: ResponseData<any>) => {
      this.message.remove(messageId);

      if (res.code === SUCCESS_CODE) {
        this.message.success('提交成功');
        this.noteForm = new Note();
        this.noteTye = false;
        this.toggleModalStatus();

        this.pageNum = 1;
        this.noteListWithCollect = [];
        this.getnNteListWithCollect();
      }
    });
  }

  checkNoteFormStatus(): boolean {
    const { title, content, categoryId } = this.noteForm;

    return [title, content, categoryId].every(item => !!item);
  }
}
