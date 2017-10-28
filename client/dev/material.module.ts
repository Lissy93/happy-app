import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";

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
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule

    // MatButton,
    // MatToolbarModule,
    // MatIconModule,
    // MatCardModule
  ]
})
export class MaterialModule {}
