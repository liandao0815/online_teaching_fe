import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="container">
      <nz-empty nzNotFoundContent="你好像迷路了~"></nz-empty>
    </div>
  `,
  styles: [
    `.container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
    }`
  ]
})
export class NotFoundComponent {
  constructor() {}
}
