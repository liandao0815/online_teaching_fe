import { Component, OnInit } from '@angular/core';
import { CollectService } from 'services/collect.service';
import Note from 'class/note';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-my-collection',
  template: `
    <app-user-center-abbr-info abbrTitle="我的收藏" [abbrData]="collectNoteList" urlPrefix="/note_detail">
    </app-user-center-abbr-info>
  `
})
export class MyCollectionComponent implements OnInit {
  collectNoteList: Note[] = [];

  constructor(private collectService: CollectService) {}

  ngOnInit() {
    this.collectService.getCollectListByUser().subscribe((res: ResponseData<Note[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.collectNoteList = res.data;
      }
    });
  }
}
