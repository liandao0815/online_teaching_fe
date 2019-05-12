import { Component, OnInit } from '@angular/core';
import { LiveService } from 'services/live.service';
import LiveRoom from 'class/live-room';
import { ResponseDataOfTable } from 'config/table-config';
import { SUCCESS_CODE } from 'config/http-config';
import { BriefItem } from 'components/index/brief-item/brief-item';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  liveRoomList: LiveRoom[] = [];
  pageNum = 1;
  pageSize = 20;
  loading = false;

  constructor(private liveService: LiveService) {}

  ngOnInit() {
    this.getLiveRoomList();
  }

  /**
   * @description 获取正在直播列表
   */
  getLiveRoomList(): void {
    const params = { pageNum: this.pageNum, pageSize: this.pageSize };

    this.loading = true;
    this.liveService.getLiveRoomListWithLiving(params).subscribe((res: ResponseDataOfTable<LiveRoom>) => {
      this.loading = false;

      if (res.code === SUCCESS_CODE) {
        this.pageNum += 1;
        this.liveRoomList = [...this.liveRoomList, ...res.data.list];
      }
    });
  }

  trackByLiveRoomList(index: number, briefItem: BriefItem) {
    return briefItem.id;
  }
}
