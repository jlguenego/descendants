import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
  ]
})
export class MaterialModule { }
