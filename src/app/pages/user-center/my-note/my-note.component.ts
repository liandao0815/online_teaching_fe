import { Component, OnInit } from '@angular/core';
import { NoteService } from 'services/note.service';
import Note from 'class/note';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-my-note',
  template: `
    <app-user-center-abbr-info abbrTitle="我的笔记" [abbrData]="noteList" urlPrefix="/note_detail">
    </app-user-center-abbr-info>
  `
})
export class MyNoteComponent implements OnInit {
  noteList: Note[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.noteService.getNoteListByUser().subscribe((res: ResponseData<Note[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.noteList = res.data;
      }
    });
  }
}
