import { Component, Input } from '@angular/core';
import { AbbrInfo } from './abbr-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-center-abbr-info',
  templateUrl: './abbr-info.component.html',
  styleUrls: ['./abbr-info.component.scss']
})
export class AbbrInfoComponent {
  @Input() abbrTitle: string;
  @Input() abbrData: AbbrInfo[];
  @Input() urlPrefix: string;

  constructor(private router: Router) {}

  handleGotoItem(id: string): void {
    this.router.navigateByUrl(`${this.urlPrefix}/${id}`);
  }

  trackByAbbrInfo(inde: number, abbrInfo: AbbrInfo): number {
    return abbrInfo.id;
  }
}
