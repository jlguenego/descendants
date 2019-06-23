import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmphaseComponent } from './emphase/emphase.component';
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [EmphaseComponent, LoadingComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [EmphaseComponent, LoadingComponent]
})
export class WidgetModule { }
