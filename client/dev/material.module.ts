import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

// import {
//   MatButtonModule,
//   MatCardModule,
//   MatMenuModule,
//   MatProgressSpinnerModule,
//   MatSelectModule,
//   MatDialogModule,
//   MatSnackBarModule,
//   MatInputModule
// } from "@angular/material";

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    // MatInputModule,
    MatFormFieldModule
  ]
})
export class MaterialModule {}
