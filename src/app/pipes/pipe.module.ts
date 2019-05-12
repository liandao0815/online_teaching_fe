import { NgModule } from '@angular/core';
import { TimesToNowPipe } from './times-to-now.pipe';

@NgModule({
  declarations: [TimesToNowPipe],
  exports: [TimesToNowPipe]
})
export class PipeModule {}
