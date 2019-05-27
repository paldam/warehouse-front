import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
	CalendarModule,
	CardModule,
	CheckboxModule,
	ConfirmDialogModule, ContextMenuModule,
	DataTableModule,
	DialogModule, DropdownModule,
	FieldsetModule, FileUploadModule, LightboxModule, ListboxModule, MenuModule, MultiSelectModule, OverlayPanelModule,
	PanelMenuModule, PanelModule, ProgressSpinnerModule, RadioButtonModule, SharedModule, SpinnerModule
} from "primeng/primeng";
import {FormsModule} from "@angular/forms";

import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";


@NgModule({
	declarations: [],
	imports: [],
	exports:[FormsModule,DialogModule,CheckboxModule,ConfirmDialogModule,PanelMenuModule,
		PanelModule,DropdownModule,ListboxModule,RadioButtonModule,ToastModule,TableModule,FileUploadModule,DataTableModule,
		SharedModule,MultiSelectModule,SpinnerModule,CardModule,ProgressSpinnerModule,FieldsetModule,LightboxModule,OverlayPanelModule,ContextMenuModule, MenuModule,CalendarModule]
})
export class PrimeNgModule {
}
