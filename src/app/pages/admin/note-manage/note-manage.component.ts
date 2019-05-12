import { Component, OnInit } from '@angular/core';
import { TableInfo, RequestParamOfTable, ResponseDataOfTable } from 'config/table-config';
import Note from 'class/note';
import { NoteService } from 'services/note.service';
import { SUCCESS_CODE, ResponseData } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-admin-note-manage',
  templateUrl: './note-manage.component.html',
  styleUrls: ['./note-manage.component.scss']
})
export class NoteManageComponent implements OnInit {
  noteQueryId: number;
  noteTitle: string;

  // 笔记表格信息
  noteTableInfo: TableInfo<Note> = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    data: []
  };

  constructor(private noteService: NoteService, private message: NzMessageService) {}

  ngOnInit() {
    this.searchNoteData();
  }

  /**
   * @description 搜索笔记列表
   * @param pageNo 页码数
   */
  searchNoteData(pageNo?: number): void {
    const { pageNum, pageSize } = this.noteTableInfo;
    const params: RequestParamOfTable = {
      pageNum: pageNo || pageNum,
      pageSize,
      id: this.noteQueryId || 0,
      title: this.noteTitle || ''
    };

    this.noteTableInfo.pageNum = pageNo || pageNum;
    this.noteTableInfo.loading = true;

    this.noteService.getNoteList(params).subscribe((res: ResponseDataOfTable<Note>) => {
      this.noteTableInfo.loading = false;

      if (res.code === SUCCESS_CODE) {
        this.noteTableInfo.total = res.data.total;
        this.noteTableInfo.data = res.data.list;
      }
    });
  }

  /**
   * @description 删除笔记
   */
  deleteNote(id: number): void {
    this.noteService.deleteNote(id).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('删除成功');
        this.searchNoteData(1);
      }
    });
  }
}
