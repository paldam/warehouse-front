import {ViewChild} from "@angular/core";
import {DataTable} from "primeng/primeng";
import {AppConstants} from "./constants";

export class CoreDataTableViewComponent {
	public loading: boolean;
	public lastVisitedPage: number;
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	@ViewChild('dt') dataTable: DataTable;

	constructor() {
	}
}
