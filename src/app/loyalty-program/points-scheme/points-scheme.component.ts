import {Component, OnInit} from '@angular/core';
import {PointScheme} from "../../model/point-scheme.model";
import {PrizeService} from "../prize.service";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {ConfirmationService, SelectItem} from "primeng/api";
import {BasketSeason} from "../../model/basket_season.model";
import {BasketService} from "../../basket/basket.service";
import {NgForm} from "@angular/forms";
import {SpinerService} from "../../spiner.service";
import {AppConstants} from "../../constans";

@Component({
	selector: 'app-points-scheme',
	templateUrl: './points-scheme.component.html',
	styleUrls: ['./points-scheme.component.css']
})
export class PointsSchemeComponent
	implements OnInit {
	public loading: boolean;
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	public pointSchemes: PointScheme[] = [];
	public showAddPointModal: boolean = false;
	public basketSeasonSelectItemList: SelectItem[] = [];
	public basketSeasonList: BasketSeason[] = [];
	public pointSchemeToAdd: PointScheme = new PointScheme();
	public formSubmitted: boolean = false;

	constructor(private basketService: BasketService, public prizeService: PrizeService,
				public  messageServiceExt: MessageServiceExt, private confirmationService: ConfirmationService,
				private spinerService: SpinerService) {
		prizeService.getPointScheme().subscribe(value => this.pointSchemes = value);
		this.basketService.getBasketSeason().subscribe(data => {
			this.basketSeasonList = data;
			this.basketSeasonList.forEach(value => {
				this.basketSeasonSelectItemList.push({label: value.basketSezonName, value: value})
			})
		});
	}

	ngOnInit() {
	}

	editPoints(pointScheme: PointScheme) {
		this.prizeService.savePointScheme(pointScheme).subscribe(
			value => {
				this.refreshData();
				this.messageServiceExt.addMessageWithTime(
					'success', 'Status', 'Dokonano edycji schematu pkt.', 5000);
			},
			error => {
				this.messageServiceExt.addMessageWithTime(
					'error', 'Błąd', "Status: " + error._body + ' ', 5000);
			}
		)
	}

	refreshData() {
		this.prizeService.getPointScheme().subscribe(value => this.pointSchemes = value);
	}

	addPoint(form: NgForm) {
		this.formSubmitted = true;
		if (this.pointSchemeToAdd.step && this.pointSchemeToAdd.points && this.pointSchemeToAdd.basketSezon) {
			this.spinerService.showSpinner = true;
			this.prizeService.savePointScheme(this.pointSchemeToAdd).subscribe(
				value => {
					this.messageServiceExt.addMessageWithTime(
						'success', 'Status', 'Dodano schemat', 5000);
				}, error => {
					this.messageServiceExt.addMessageWithTime(
						'error', 'Błąd', "Status: " + error._body + ' ', 5000);
					this.spinerService.showSpinner = false;
				}, () => {
					this.showAddPointModal = false;
					this.refreshData();
					this.formSubmitted = false;
					this.pointSchemeToAdd = new PointScheme();
					form.resetForm();
					this.spinerService.showSpinner = false;
				});
		}
	}

	ShowConfirmModal(pointScheme: any) {
		this.confirmationService.confirm({
			message: 'Jesteś pewny że chcesz usunać ten wiersz ?',
			accept: () => {
				this.spinerService.showSpinner = true;
				this.prizeService.deletePointScheme(pointScheme.id).subscribe(data => {
					this.refreshData();
				}, error1 => {
					this.spinerService.showSpinner = false;
				}, () => {
					this.spinerService.showSpinner = false;
				});
			},
			reject: () => {
			}
		});
	}
}
