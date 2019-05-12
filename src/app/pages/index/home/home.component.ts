import { Component, OnInit } from '@angular/core';
import { CommonService } from 'services/common.service';
import { HomePageData } from './home';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import LiveRoom from 'class/live-room';
import { BriefItem } from 'components/index/brief-item/brief-item';
import Course from 'class/course';
import Note from 'class/note';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homePageData = new HomePageData();

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.getHomePageData();
  }

  getHomePageData(): void {
    this.commonService.getHomePageData().subscribe((res: ResponseData<HomePageData>) => {
      if (res.code === SUCCESS_CODE) {
        this.homePageData = res.data;
      }
    });
  }

  trackByLiveRoomList(index: number, briefItem: BriefItem) {
    return briefItem.id;
  }

  trackByCouseList(index: number, briefItem: BriefItem) {
    return briefItem.id;
  }

  trackByNoteList(index: number, note: Note) {
    return note.id;
  }

  trackByProblemList(index: number, problem: Note) {
    return problem.id;
  }
}
