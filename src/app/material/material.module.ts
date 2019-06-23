import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule
} from '@angular/material';

const imports = [
  MatButtonModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [],
  imports,
  exports: imports
})
export class MaterialModule { }
