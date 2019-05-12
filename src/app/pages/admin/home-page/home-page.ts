import Activity from 'class/activity';

export interface TodayData {
  name: string;
  tooltip: string;
  amount?: number;
}

export interface TotalData {
  name: string;
  tooltip: string;
  amount?: number;
  color: string;
}

export interface AdminHomeData {
  todayData: number[];
  totalData: number[];
  activityData: Activity[];
}
