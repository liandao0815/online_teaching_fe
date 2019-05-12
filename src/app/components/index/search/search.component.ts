import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SearchData } from './search';
import { CommonService } from 'services/common.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  searchLoading = false;
  searchValue$ = new BehaviorSubject('');
  searchData: SearchData = { liveRoom: null, course: [], note: [] };
  selectValue: string;

  constructor(private commonService: CommonService, private router: Router) {}

  ngOnInit() {
    const searchSub = this.searchValue$
      .pipe(
        debounceTime(500),
        switchMap(this.commonService.getSearchData)
      )
      .subscribe((res: ResponseData<SearchData>) => {
        this.searchLoading = false;
        if (res.code === SUCCESS_CODE) {
          this.searchData = res.data;
        }
      });

    this.subscription.add(searchSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * @description 处理搜索框改变事件
   */
  handleSearchChange(value: string): void {
    this.searchData = { liveRoom: null, course: [], note: [] };
    this.searchLoading = true;
    this.searchValue$.next(value.trim());
  }

  /**
   * @description 处理搜索框点击item事件
   */
  handleSearchModelChange(value: string): void {
    let url: string;

    if (!value) {
      return;
    }

    if (value.startsWith('liveRoom')) {
      url = `/live_room/${value.replace('liveRoom', '')}`;
    }
    if (value.startsWith('course')) {
      url = `/course_detail/${value.replace('course', '')}`;
    }
    if (value.startsWith('note')) {
      url = `/note_detail/${value.replace('note', '')}`;
    }

    this.router.navigateByUrl(url);
  }
}
