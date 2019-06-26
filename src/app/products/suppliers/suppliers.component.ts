import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductsService} from "../products.service";
import {AuthenticationService, TOKEN_USER} from "../../authentication.service";
import {Supplier} from "../../model/supplier.model";
import {CoreDataTableViewComponent} from "../../coreViewComponent";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {User} from "../../model/user.model";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SuppliersComponent extends CoreDataTableViewComponent implements OnInit {
  public suppliers : Supplier [] = [];

    public addSupplierDialogShow: boolean = false;
    public tmpSupplierName: string;
    public formSubmitted: boolean = false;
    @ViewChild('supplier_name') formSupplierNameInputField: any;



  constructor(private productsService: ProductsService , public authenticationService: AuthenticationService, public messageServiceExt  : MessageServiceExt,private confirmationService: ConfirmationService) {

      super();

      productsService.getSuppliers().subscribe(data=> this.suppliers = data);




  }

  ngOnInit() {
  }

	refreshData() {
		this.loading = true;
		setTimeout(() => {
			this.productsService.getSuppliers().subscribe(data=> this.suppliers = data);
			this.loading = false;
		}, 1000);
	}


	editSupplier(supplier){

      this.productsService.saveSupplier(supplier).subscribe(
          value => {
            this.refreshData()
                this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dokonano edycji nazwy',5000);
          },
          error => {
                this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ',5000  );
          }
          )

    }

    addSupplierShow(){

        this.addSupplierDialogShow = true;


    }



    addSupplier(){

      this.formSubmitted = true;

      let tmpName : string = this.formSupplierNameInputField.nativeElement.value;

      if (tmpName.length > 0 ){
          this.productsService.saveSupplier(new Supplier(null,this.tmpSupplierName)).subscribe(
              value => {
                  this.messageServiceExt.addMessageWithTime('success', 'Status', 'Dodano dostawcę',5000);

          },  error =>{
                  this.messageServiceExt.addMessageWithTime('error', 'Błąd', "Status: " + error._body + ' ',5000  );
              } )

          this.formSubmitted = false;
          this.tmpSupplierName = "";
          this.addSupplierDialogShow = false;
          this.refreshData();
      }


    }


    closeSupplierAddDialog(){
        this.addSupplierDialogShow = false;
    }

    deleteSupplier(supplier: Supplier) {
        this.confirmationService.confirm({
            key:"resetSupplier",
            message: 'Jesteś pewny że chcesz usunąć tego dostawcę  ?',
            accept: () => {
                this.productsService.deleteSupplier(supplier.supplierId).subscribe(
                    data => {
                        this.messageServiceExt.addMessageWithTime('success', 'Status', 'Usunięto dostawcę',5000);
                        this.refreshData();
                    },
                    error => {
                        this.messageServiceExt.addMessageWithTime('error', 'Błąd',  'Nie można usunac tego dostawcy ',5000  );
                    }
                )

            },
            reject: () => {

            }
        });
    }


}
