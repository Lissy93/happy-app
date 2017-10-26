import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    // MatButton,
    // MatMenuModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatCardModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    // MatButton,
    // MatMenuModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatCardModule
  ]
})
export class MaterialModule {}
