import {Component, OnInit} from '@angular/core';
import {User} from "../model/user.model";
import {Authorities} from "../model/authorities.model";
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ConfirmationService} from "primeng/primeng";
import {AuthenticationService, TOKEN_USER} from "../authentication.service";
import {AdminService} from "./admin.service";
import {MessageServiceExt} from "../messages/messageServiceExt";
import {BasketSeason} from "../model/basket_season.model";
import {BasketService} from "../basket/basket.service";
import {ProductsService} from "../products/products.service";
import {ProductSeason} from "../model/product_season.model";
import {ProductType} from "../model/product_type.model";

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent
	implements OnInit {
	public user: User = new User();
	public basketSezonName: string;
	public productSezonName: string;
	public usersList: User[] = [];
	public authorities: Authorities[] = [];
	public formSubmitted: boolean = false;
	public formSeasonSubmitted: boolean = false;
	public addInactiveProductModal: boolean = false;
	public formSeasonProductSubmitted: boolean = false;


	public passwordDontMatch: any = null;
	public passwordConfirm: string = '';
	public status: string = '';
	public body: string = '';
	public changeModal: boolean = false;
	public selectedUser: User = new User();
	public authoritiesToSave: Authorities [] = [];
	public basketSeasonList: BasketSeason[] = [];
	public productSeasonList: ProductSeason[] = [];
	public inactiveProductsTypes: ProductType[]=[];
	public productsTypes: ProductType[]=[];
	public loading: boolean;

	constructor(private basketService: BasketService,private userService: UserService, private router: Router, private confirmationService: ConfirmationService,
				public authenticationService: AuthenticationService, public productService: ProductsService, public adminService: AdminService,
				private messageServiceExt: MessageServiceExt) {
		userService.getAuthorities().subscribe(data => {
			this.authorities = data
		});
		userService.getUsers().subscribe(data => {
			this.usersList = data
		});

		this.basketService.getBasketSeason().subscribe(data => {
			this.basketSeasonList = data;

		});

		this.productService.getProductSeasons().subscribe(data => {
			this.productSeasonList = data;

		});

		this.productService.getInactiveProductsTypes().subscribe(data => {
			this.inactiveProductsTypes = data;

		});

		this.productService.getProductsTypes().subscribe(data => {
			this.productsTypes = data;

		})


	}

	ngOnInit() {
	}

	refreshData() {
		this.userService.getUsers().subscribe(data => this.usersList = data);
		this.basketService.getBasketSeason().subscribe(data => {
			this.basketSeasonList = data;
			this.basketSeasonList.reverse();
		});
		this.productService.getProductSeasons().subscribe(data => {
			this.productSeasonList = data;

		});


	}

	submitForm(form: NgForm) {
		this.formSubmitted = true;
		if (form.valid) {
			if (this.user.password != this.passwordConfirm) {
				this.passwordDontMatch = "Hasła są różne";
			} else {
				this.passwordDontMatch = null;
				this.userService.saveUser(this.user).subscribe(data => {
					this.user = new User();
					this.status = data.text();
					this.refreshData();
					this.formSubmitted = false;
					form.reset();
				}, err => {
					if (err.status == 500) {
						this.status = "Błąd połączenia z bazą danych"
					} else {
						this.status = err.text();
					}
				});
			}
		}
	}

	submitSeasonForm() {
		this.formSeasonSubmitted = true;
		if (this.basketSezonName) {

			let season = new BasketSeason();
			season.basketSezonName = this.basketSezonName.toUpperCase();

			this.basketService.addBasketSeason(season).subscribe(data => {
					this.basketSezonName= null;
					this.refreshData();
					this.formSeasonSubmitted = false;
					this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano sezon', 5000);

				}, err => {
					if (err.status == 500) {
						this.status = "Błąd połączenia z bazą danych"
					} else {
						this.status = err.text();
					}
				});
			}
		}


	submitProductSeasonForm() {
		this.formSeasonProductSubmitted = true;
		if (this.productSezonName) {

			let season = new ProductSeason();
			season.productSeasonName = this.productSezonName.toUpperCase();

			this.productService.saveProductSeason(season).subscribe(data => {
				this.productSezonName= null;
				this.refreshData();
				this.formSeasonProductSubmitted = false;
				this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano sezon', 5000);

			}, err => {
				if (err.status == 500) {
					this.status = "Błąd połączenia z bazą danych"
				} else {
					this.status = err.text();
				}
			});
		}
	}



	submitChangeAuthForm(form: NgForm) {
		this.selectedUser.authorities = this.authoritiesToSave;
		this.userService.updateUser(this.selectedUser).subscribe(data => {
			this.authoritiesToSave = null;
			this.changeModal = false;
		}, err => {
			console.log("Problem przy modyfikowaniu uprawnień użytkownika")
		});
	}

	ShowConfirmModal(user: User) {
		this.confirmationService.confirm({
			key: "removeDialog",
			message: 'Jesteś pewny że chcesz usunąć użytkownika  ' + user.login + ' ?',
			accept: () => {
				let currentUser = localStorage.getItem(TOKEN_USER);
				if (user.login != currentUser) {
					this.userService.deleteUser(user.login).subscribe(data => {
						this.refreshData();
					});
				} else {
					console.log("Uwaga Nie można usunąć konta na którym jesteś zalogowany")
				}
			},
			reject: () => {
			}
		});
	}

	ShowConfirmResetModal(user: User) {
		this.confirmationService.confirm({
			key: "resetDialog",
			message: 'Jesteś pewny że chcesz zresetować hasło użytkownikowi:  ' + user.login + ' ?',
			accept: () => {
				this.userService.resetPassword(user.login).subscribe(data => {
				});
			},
			reject: () => {
			}
		});
	}

	showAddInactiveProductDialog() {
		this.addInactiveProductModal = true;

	}

	addToInactive(typeId: number) {
		this.addInactiveProductModal = false;
		this.productService.setTypeInactive(typeId).subscribe(value => {
		}, error1 => {
		}, () => {
		});

		setTimeout(() => {
			this.productService.getInactiveProductsTypes().subscribe(data => {
				this.inactiveProductsTypes = data;
			});

		}, 1000);

	}

	removeFromInactive(typeId :number){
		this.addInactiveProductModal = false;
		this.productService.setTypeActive(typeId).subscribe(value => {

		});
		setTimeout(() => {
			this.productService.getInactiveProductsTypes().subscribe(data => {
				this.inactiveProductsTypes = data;
			});

		}, 1000);
	}

	showChangeDialog(user: User) {
		this.changeModal = true;
		this.selectedUser = user;
	}

	resetDbAllStockState() {
		this.confirmationService.confirm({
			key: "resetState", message: 'Jesteś pewny że chcesz zresetować stan magazynowy ?', accept: () => {
				this.adminService.resetProductsStates().subscribe(data => {
					setTimeout(() => {
						this.messageServiceExt.addMessageWithTime('success', 'Status', 'Wyzerowano stany magazynowe', 5000);
					}, 400);
				}, error => {
					setTimeout(() => {
						this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error._body + ' ');
					}, 400);
				})
			}, reject: () => {
			}
		});
	}
}
