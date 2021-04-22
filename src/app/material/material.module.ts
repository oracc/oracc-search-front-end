import { NgModule } from '@angular/core';
import {MatSortModule} from '@angular/material/sort';

const MaterialComponents = [
	MatSortModule
];

@NgModule({
  imports: [
		MaterialComponents
	],
  exports: [
		MaterialComponents
	]
})
export class MaterialModule { }
