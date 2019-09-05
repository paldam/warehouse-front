import {Component, OnInit, ViewChild} from '@angular/core';
import {Basket} from '../../model/basket.model';
import {BasketService} from '../basket.service';
import {Router} from '@angular/router';
import {LazyLoadEvent, SelectItem} from "primeng/api";
import {DataTable} from "primeng/primeng";


@Component({
    selector: 'gift-baskets',
    templateUrl: './gift-baskets.component.html',
    styleUrls: ['./gift-baskets.component.css'],
})

export class GiftBasketComponent implements OnInit {

    public baskets: Basket[] = [];
    public loading: boolean;
    public url: string ='';
	public basketSeasonList: SelectItem[] = [];
    public gb: any;
	public totalRecords: number;
	@ViewChild('dt') datatable: DataTable;

    constructor(private basketService: BasketService, private router :Router) {
        this.url = router.url;
        this.getBasketSeasonForDataTableFilter();
		this.basketService.getBasketsPage(0,10,"","basketId",1,false,[]).subscribe((data :any) =>  {
			this.baskets = data.basketsList;
			this.totalRecords = data.totalRowsOfRequest;
		});
    }

    ngOnInit() {
    }
	private getBasketSeasonForDataTableFilter() {
		this.basketService.getBasketSeason().subscribe(data => {
			data.forEach(value => {
				this.basketSeasonList.push({label: '' + value.basketSezonName, value: value.basketSezonId});
			});
		});
	}

	loadBasketsLazy(event: LazyLoadEvent) {



		this.loading = true;
		let pageNumber = 0;
		if (event.first) {
			pageNumber = event.first / event.rows;
		}
		let sortField = event.sortField;

		if (sortField == undefined) {
			sortField = "basketId";
		}

		let basketSeasonList: any[] = [];
		if (event.filters != undefined && event.filters["basketSezon.basketSezonName"] != undefined) {
			basketSeasonList= event.filters["basketSezon.basketSezonName"].value;
		}




		this.basketService.getBasketsPage(pageNumber,event.rows,"",sortField,event.sortOrder,false,basketSeasonList).subscribe((data: any) => {
				this.baskets = data.basketsList;
				this.totalRecords = data.totalRowsOfRequest;
			}, null
			, () => {
				this.loading = false;
			})
	}


    refreshData() {
        this.loading = true;
        setTimeout(() => {
			this.basketService.getBasketsPage(0,10,"","basketId",1,false,[]).subscribe((data :any) => {
				this.baskets = data.basketsList;
				this.totalRecords = data.totalRowsOfRequest;
			});
            this.loading = false;
        }, 1000);
    }

}