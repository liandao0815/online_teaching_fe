import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-title',
  template: `
    <div class="title">
      {{ titleName }}
    </div>
  `,
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  @Input() titleName: string;
}
