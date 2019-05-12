import { Injectable } from '@angular/core';
import { TodayData, TotalData } from './home-page';
import { EChartOption } from 'echarts';

@Injectable()
export class HomePageService {
  todayData: TodayData[] = [
    {
      name: '用户登录',
      tooltip: '今日用户登录的数量',
      amount: 0
    },
    {
      name: '教师直播',
      tooltip: '今日教师直播的数量',
      amount: 0
    },
    {
      name: '上传课程',
      tooltip: '今日上传课程的数量',
      amount: 0
    },
    {
      name: '上传笔记',
      tooltip: '今日上传笔记的数量',
      amount: 0
    }
  ];

  echarsOption: EChartOption = {
    color: ['#1aa1ff'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisTick: { alignWithLabel: true },
        axisLine: {
          lineStyle: { color: '#9a9a9a' }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#9a9a9a' }
        }
      }
    ],
    series: [
      {
        name: '月活跃人数',
        type: 'bar',
        barWidth: '50%',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };

  totalData: TotalData[] = [
    {
      name: '用户统计',
      tooltip: '当前用户总数',
      amount: 0,
      color: '#5e83fb'
    },
    {
      name: '直播间统计',
      tooltip: '当前直播间总数',
      amount: 0,
      color: '#f7da47'
    },
    {
      name: '课程统计',
      tooltip: '当前上传课程总数',
      amount: 0,
      color: '#58ca9a'
    },
    {
      name: '笔记统计',
      tooltip: '当前上传笔记总数',
      amount: 0,
      color: '#ee706d'
    }
  ];
}
