import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BasketService} from "../basket.service";
import {Router} from "@angular/router";
import {Basket} from "../../model/basket.model";
import {ConfirmationService, DataTable,OverlayPanel} from "primeng/primeng";
import {BasketType} from "../../model/basket_type.model";
import {AuthenticationService} from "../../authentication.service";
import {AppConstans} from "../../constans";
import {ProductSubType} from "../../model/product_sub_type";
import {ProductsService} from "../../products/products.service";
import {SpinerService} from "../../spiner.service";


@Component({
	selector: 'app-basket',
	templateUrl: './basket-view.component.html',
	styleUrls: ['./basket-view.component.css']
})
export class BasketComponent implements OnInit {
	public priceMin: number = 0;
	public priceMax: number= 9999;
	public baskets: Basket[] = [];
	public loading: boolean;
	public gb: any;
	public url: string = '';
	public imageToShow: any;
	public showImageFrame: boolean = false;
	@ViewChild('onlyDeleted') el: ElementRef;
	@ViewChild('op') overlayPanel: OverlayPanel;
	@ViewChild('dt') datatable: DataTable;
	public paginatorValues = AppConstans.PAGINATOR_VALUES;
	public productSubType: ProductSubType[]=[];
	public selectedCategories : number[]=[];

	constructor(private spinerService :SpinerService ,private productsService :ProductsService, private basketService: BasketService, public router: Router, private confirmationService: ConfirmationService, private authenticationService: AuthenticationService) {
		basketService.getBaskets().subscribe(data => this.baskets = data);
		productsService.getProductsSubTypes().subscribe((data: ProductSubType[]) => {
			data.forEach(value => {
				this.productSubType = data;

			})
		});
		this.url = router.url;
	}

	ngOnInit() {
	}

	getBasketWithFilter(){
		this.spinerService.showSpinner=true;
		this.basketService.getBasketWithFilter(this.priceMin, this.priceMax,this.selectedCategories).subscribe(data =>{
			this.baskets = data;

		},error => {
			this.spinerService.showSpinner=false;
		},() => {
			setTimeout(() => {
				this.spinerService.showSpinner=false;    ;
			}, 500);

		})
	}




	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.clickOnlyDeletedBasketChceckBox();
			this.loading = false;
		}, 1000);
	}

	ShowConfirmModal(basket: Basket) {
		if (basket.basketType.basketTypeId == 99) {
			this.confirmationService.confirm({
				message: 'Jesteś pewny że chcesz trwale usunąć kosz ? ',
				accept: () => {
					let tmpBaskettype: BasketType = new BasketType(999);
					basket.basketType = tmpBaskettype;
					this.basketService.saveBasketWithoutImg(basket).subscribe(data => {
						this.refreshData();
					});
				},
				reject: () => {
				}
			});
		} else {
			this.confirmationService.confirm({
				message: 'Jesteś pewny że chcesz przenieś kosz  ' + basket.basketName + ' do archiwum ?',
				accept: () => {
					let tmpBaskettype: BasketType = new BasketType(99);
					basket.basketType = tmpBaskettype;
					this.basketService.saveBasketWithoutImg(basket).subscribe(data => {
						this.refreshData();
					});
				},
				reject: () => {
				}
			});
		}
	}

	clickOnlyDeletedBasketChceckBox() {
		if (this.el.nativeElement.checked) {
			this.basketService.getDeletedBaskets().subscribe(data => this.baskets = data);
		} else {
			this.basketService.getBaskets().subscribe(data => this.baskets = data);
		}
	}

	showBacketImg(event, basketId: number) {
		this.basketService.getBasketImg(basketId).subscribe(res => {
			this.createImageFromBlob(res);
		}, error => {
		}, complete => {
		});
		this.showImageFrame = true;
	}

	private createImageFromBlob(image: Blob) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			this.imageToShow = reader.result;
		}, false);
		if (image) {
			reader.readAsDataURL(image);
		}
	}

	printProductListInBasketPdf(basketId: number) {
		this.basketService.getBasketPdf(basketId).subscribe(res => {
				var fileURL = URL.createObjectURL(res);
				window.open(fileURL);
			}
		)
	}
}
