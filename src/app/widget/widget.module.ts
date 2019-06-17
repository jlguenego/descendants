import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmphaseComponent } from './emphase/emphase.component';

@NgModule({
  declarations: [EmphaseComponent],
  imports: [
    CommonModule
  ],
  exports: [EmphaseComponent]
})
export class WidgetModule { }
