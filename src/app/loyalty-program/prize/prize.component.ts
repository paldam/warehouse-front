import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PrizeService} from "../prize.service";
import {Prize} from "../../model/prize";
import {User} from "../../model/user.model";
import {AppConstants} from "../../constans";
import {JhiDataUtils} from "ng-jhipster";
import {PrizeImgExt} from "../../model/prize_img_ext.model";
import {NgForm} from "@angular/forms";
import {BasketExt} from "../../model/BasketExt";
import {FileUpload, MenuItem} from "primeng/primeng";
import {PrizeOrder} from "../../model/prize-order.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";

@Component({
  selector: 'app-prize',
  templateUrl: './prize.component.html',
  styleUrls: ['./prize.component.css']
})
export class PrizeComponent implements OnInit {

  public prizeList :Prize[]=[];
	@ViewChild('globalfilter2') gb: ElementRef;
	public loading: boolean;
	public paginatorValues = AppConstants.PAGINATOR_VALUES;
	public showAddPrizeModal: boolean = false;
	public showChangeImgModal: boolean = false;
	public formSubmitted: boolean = false;
	public prizeToAdd: Prize = new Prize();
	public prizeImgExt : PrizeImgExt= new PrizeImgExt();
	public menuItems: MenuItem[];
	public fileToUpload: File = null;
	public selectedPrizeFromRow: Prize= new Prize();
	@ViewChild(FileUpload) fileUploadElement: FileUpload;
	@ViewChild('fileupl') fileUploadElementForEditImg:FileUpload;


  constructor(private cdRef: ChangeDetectorRef,private prizeService:PrizeService,private dataUtils: JhiDataUtils, private messageServiceExt: MessageServiceExt) {

    prizeService.getPrize().subscribe(data => {
      this.prizeList = data;
    })


  }

  ngOnInit() {
	  this.setContextMenu();
	  setTimeout(() => {
	      console.log(this.prizeList);
	  }, 3000);
  }

	editPrize(prize){

		this.prizeService.savePrizeNoImg(prize).subscribe(
			value => {
				this.refreshData();
				this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji',5000);
			},
			error => {
				this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ',5000  );
			}
		)

	}


	savePrize(form: NgForm) {
		this.formSubmitted = true;

		if (form.valid  && this.fileUploadElement.files.length == 1)  {
			console.log("222");
			this.prizeService.savePrize(this.prizeToAdd,this.fileToUpload).subscribe(data=>{
					this.prizeToAdd=new Prize();
					this.prizeImgExt = new PrizeImgExt();
					form.resetForm();
					this.formSubmitted = false;
				},
				err =>  console.log("error " ));
		}

	}

	editPrizeImg(form: NgForm) {
		this.formSubmitted = true;

		console.log("magroda"  +JSON.stringify(this.prizeToAdd));
		console.log("zawartosc plikus"  +JSON.stringify(this.fileToUpload));
		if (form.valid  && this.fileUploadElementForEditImg.files.length == 1)  {
			console.log("555");
			this.prizeService.editPrize(this.prizeToAdd,this.fileToUpload).subscribe(data=>{
					this.prizeToAdd=new Prize();
					this.prizeImgExt = new PrizeImgExt();
					form.resetForm();
					this.formSubmitted = false;
				},
				err => {
					this.messageServiceExt.addMessage('error', 'Błąd ', err._body);
				}
				,() => {
					this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono zdjęcie');

					window.location.reload();
				});
		}

	}


	enableUploadButton(){
		this.fileUploadElement.disabled = false;
	}

	getPrizeFromRow(event) {
		this.selectedPrizeFromRow = event.data;
	}

	private setContextMenu() {
		this.menuItems = [
			{
				label: 'Zmień dostępność ', icon: 'fa fa-share',
				items: [
					{label: 'Dostępne', icon: 'pi pi-fw pi-plus', command: () => this.changePrizeStatus(true)},
					{label: 'Niedostępne', icon: 'pi pi-fw pi-plus', command: () => this.changePrizeStatus(false)},
				],
			}, {
				label: 'Zmień zdjęcie ', icon: 'fa fa-picture-o', command: () => this.changeImgPanel()
			}
		];
	}

	changePrizeStatus(isPrizeAvailable: boolean) {

		this.prizeService.changePrizeStatus(this.selectedPrizeFromRow.id, isPrizeAvailable).subscribe(data => {
			this.messageServiceExt.addMessage('success', 'Status', 'Zmieniono dostępność nagrody');
		}, error => {
			this.messageServiceExt.addMessage('error', 'Błąd ', error._body);
		}, () => {
			this.refreshData();
		});

	}
	changeImgPanel(){

  	this.showChangeImgModal = true;
  	this.prizeToAdd = this.selectedPrizeFromRow;
	}

	refreshData(){
		this.prizeService.getPrize().subscribe(data => {
			this.prizeList = data;
		})

	}


	handleFileInput(event){



		this.fileToUpload = this.fileUploadElement.files[0];



		if(this.fileUploadElement.files.length ==1){
			this.fileUploadElement.disabled = true;

		}

	}

	handleFileInputForAddImg(event){



		this.fileToUpload = this.fileUploadElementForEditImg.files[0];
		console.log("555");
		console.log(this.fileToUpload);


		if(this.fileUploadElementForEditImg.files.length ==1){
			this.fileUploadElementForEditImg.disabled = true;

		}

	}

}
