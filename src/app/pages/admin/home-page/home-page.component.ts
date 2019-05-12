import { Component, OnInit } from '@angular/core';
import { HomePageService } from './home-page.service';
import { TodayData, TotalData, AdminHomeData } from './home-page';
import { EChartOption } from 'echarts';
import { CommonService } from 'services/common.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import Activity from 'class/activity';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [HomePageService]
})
export class HomePageComponent implements OnInit {
  todayData: TodayData[];
  echarsOption: EChartOption;
  totalData: TotalData[];

  constructor(private homePageService: HomePageService, private commonService: CommonService) {
    this.todayData = this.homePageService.todayData;
    this.echarsOption = this.homePageService.echarsOption;
    this.totalData = this.homePageService.totalData;
  }

  ngOnInit() {
    this.getAdminHomeData();
  }

  getAdminHomeData(): void {
    this.commonService.getAdminHomeData().subscribe((res: ResponseData<AdminHomeData>) => {
      if (res.code === SUCCESS_CODE) {
        this.initAdminHomeData(res.data);
      }
    });
  }

  /**
   * @description 初始化首页数据
   */
  private initAdminHomeData(adminHomeData: AdminHomeData): void {
    adminHomeData.todayData.forEach((item, index) => {
      this.todayData[index].amount = item;
    });

    const newEcharsOption = { ...this.echarsOption };
    newEcharsOption.xAxis[0].data = this.getEcharXAxisData(adminHomeData.activityData);
    (newEcharsOption.series[0] as any).data = adminHomeData.activityData.map(activity => activity.count);

    this.echarsOption = newEcharsOption;

    adminHomeData.totalData.forEach((item, index) => {
      this.totalData[index].amount = item;
    });
  }

  private getEcharXAxisData(activityArr: Activity[]): string[] {
    return activityArr.map(activity => `${String(activity.year).slice(2)}年${activity.month}月`);
  }
}
