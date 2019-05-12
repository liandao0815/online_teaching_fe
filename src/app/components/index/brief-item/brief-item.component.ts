import { Component, Input } from '@angular/core';
import { BriefItem } from './brief-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brief-item',
  templateUrl: './brief-item.component.html',
  styleUrls: ['./brief-item.component.scss']
})
export class BriefItemComponent {
  @Input() itemInfo: BriefItem;
  @Input() urlPrefix: string;

  constructor(private router: Router) {}

  handleClickItem(id: number): void {
    this.router.navigateByUrl(`${this.urlPrefix}/${id}`);
  }
}
