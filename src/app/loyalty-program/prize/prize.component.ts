import { Component, OnInit } from '@angular/core';
import {PrizeService} from "../prize.service";
import {Prize} from "../../model/prize";
import {User} from "../../model/user.model";
import {AppConstans} from "../../constans";
import {JhiDataUtils} from "ng-jhipster";
import {PrizeImgExt} from "../../model/prize_img_ext.model";
import {NgForm} from "@angular/forms";
import {BasketExt} from "../../model/BasketExt";

@Component({
  selector: 'app-prize',
  templateUrl: './prize.component.html',
  styleUrls: ['./prize.component.css']
})
export class PrizeComponent implements OnInit {

  public prizeList :Prize[]=[];

	public loading: boolean;
	public paginatorValues = AppConstans.PAGINATOR_VALUES;
	public showAddPrizeModal: boolean = false;
	public formSubmitted: boolean = false;
	public prizeToAdd: Prize = new Prize();
	public prizeImgExt : PrizeImgExt= new PrizeImgExt();


  constructor(private prizeService:PrizeService,private dataUtils: JhiDataUtils) {

    prizeService.getPrize().subscribe(data => {
      this.prizeList = data;
    })


  }

  ngOnInit() {
  }



	savePrize(form: NgForm) {
		this.formSubmitted = true;

		if (form.valid ) {

			this.prizeService.savePrize(this.prizeToAdd,this.prizeImgExt.prizeToAddImg).subscribe(data=>{
					this.prizeToAdd=new Prize();
					this.prizeImgExt = new PrizeImgExt();
					form.resetForm();
					this.formSubmitted = false;
				},
				err =>  console.log("error " ));
		}

	}


	byteSize(field) {
		return this.dataUtils.byteSize(field);
	}

	openFile(contentType, field) {
		return this.dataUtils.openFile(contentType, field);
	}

	setFileData(event, entity, field, isImage) {


		this.dataUtils.setFileData(event, entity, field, isImage);
	}


}
