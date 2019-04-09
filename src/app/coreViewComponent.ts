import {ViewChild} from "@angular/core";
import {DataTable} from "primeng/primeng";
import {AppConstans} from "./constans";
import {AuthenticationService} from "./authentication.service";
import {MessageServiceExt} from "./messages/messageServiceExt";

export class CoreDataTableViewComponent {

    public loading: boolean;
    public lastVisitedPage: number;
    public paginatorValues = AppConstans.PAGINATOR_VALUES;
    @ViewChild('dt') dataTable: DataTable;

    constructor() {

    }

}
