import { Component, OnInit } from '@angular/core';
import { LiveRoomStatus, VerifyLiveRoomForm } from './live-manage';
import { LiveService } from 'services/live.service';
import LiveRoom from 'class/live-room';
import { TableInfo, RequestParamOfTable, ResponseDataOfTable } from 'config/table-config';
import { SUCCESS_CODE, ResponseData } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-admin-live-manage',
  templateUrl: './live-manage.component.html',
  styleUrls: ['./live-manage.component.scss']
})
export class LiveManageComponent implements OnInit {
  liveRoomStatus: LiveRoomStatus[] = [
    { name: '全部', value: '' },
    { name: '待审核', value: '0' },
    { name: '审核通过', value: '1' },
    { name: '审核不通过', value: '2' },
    { name: '已冻结', value: '3' }
  ];
  verifyLiveRoomForm = new VerifyLiveRoomForm(0);
  liveRoomQueryId: number;

  currentTabValue = '';
  currentVerifyId = 0;
  verifyModalStatus = false;
  detailModalStatus = false;
  liveRoomDetail: LiveRoom;

  // 直播间表格信息
  liveRoomTableInfo: TableInfo<LiveRoom> = {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    data: []
  };

  constructor(private liveService: LiveService, private message: NzMessageService) {}

  ngOnInit() {
    this.searchLiveData();
  }

  handleTabClick(value: string): void {
    this.currentTabValue = value;
    this.searchLiveData(1);
  }

  getLiveRoomStatusName(value: string): string {
    return this.liveRoomStatus.find(i => i.value === value).name;
  }

  getLiveRoomStatusColor(value: string): string {
    switch (value) {
      case '1':
        return 'green';
      case '2':
        return 'orange';
      case '3':
        return 'red';
    }
  }

  /**
   * @description 搜索直播间列表
   * @param pageNo 页码数
   */
  searchLiveData(pageNo?: number): void {
    const { pageNum, pageSize } = this.liveRoomTableInfo;
    const params: RequestParamOfTable = {
      pageNum: pageNo || pageNum,
      pageSize,
      id: this.liveRoomQueryId || 0,
      status: this.currentTabValue
    };

    this.liveRoomTableInfo.pageNum = pageNo || pageNum;
    this.liveRoomTableInfo.loading = true;

    this.liveService.getLiveRoomList(params).subscribe((res: ResponseDataOfTable<LiveRoom>) => {
      this.liveRoomTableInfo.loading = false;

      if (res.code === SUCCESS_CODE) {
        this.liveRoomTableInfo.total = res.data.total;
        this.liveRoomTableInfo.data = res.data.list;
      }
    });
  }

  getLiveRoomDetail(id: number): void {
    this.liveRoomDetail = null;
    this.liveService.getLiveRoomByAdmin(id).subscribe((res: ResponseData<LiveRoom>) => {
      if (res.code === SUCCESS_CODE) {
        this.liveRoomDetail = res.data;
      }
    });
  }

  changeLiveRoomStatus(id: number, status: string): void {
    let params: any = { id, status };

    if (status === '2') {
      params = { ...params, reason: this.verifyLiveRoomForm.reason };
    }

    this.liveService.updateLiveRoomStatus(params).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('操作成功');
        this.verifyLiveRoomForm = new VerifyLiveRoomForm(0);
        this.verifyModalStatus = false;
        this.searchLiveData(this.liveRoomTableInfo.pageNum);
      }
    });
  }
}
