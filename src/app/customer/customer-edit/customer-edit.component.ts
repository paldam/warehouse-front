import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {CustomerService} from "../customer.service";
import {Customer} from "../../model/customer.model";
import {Address} from "../../model/address.model";
import {Form, NgForm} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {Product} from "../../model/product.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {

  public customer: Customer = new Customer();
  public addAddressDialogShow: boolean = false;
  public changeMainAddressDialogShow: boolean = false;
  public addressToAdd: Address = new Address();
  public formSubmitted: boolean = false;
  public pickCityByZipCodeWindow: boolean = false;
  public tmpCityList: any[] = [];
  public selectedValue: any;
  public selectedAddr: any;
  @ViewChild('zip_code') el: any;

  constructor(private router: Router, private customerService: CustomerService, activeRoute: ActivatedRoute, private messageService: MessageService,
              private confirmationService: ConfirmationService, private messageServiceExt: MessageServiceExt) {
    customerService.getCustomer(activeRoute.snapshot.params["id"]).subscribe(data => {

      data.addresses.sort(this.compareAddress);
      this.customer = data;

    })

  }

  ngOnInit() {



  }

  compareAddress(a: Address, b: Address) {
    if (a.isPrimaryAddress > b.isPrimaryAddress)
      return -1
    if (a.isPrimaryAddress < b.isPrimaryAddress)
      return 1
  }

  showAddAddressWindow() {
    this.addAddressDialogShow = true;

  }

  showChangeMainAddressWindow(){

    this.changeMainAddressDialogShow = true;
  }

  submitAddAddresForm(form: NgForm) {
    this.formSubmitted = true;
    if (form.valid) {
        this.customer.addresses.push(this.addressToAdd);

        this.customerService.saveCustomers(this.customer).subscribe(data => {

            this.addAddressDialogShow = false;
            form.reset();
            this.formSubmitted = false;
            this.showSuccessMassage();

            this.customerService.getCustomer(this.customer.customerId).subscribe(data => {
                data.addresses.sort(this.compareAddress);
                this.customer = data;
              })

         }, error => {

              this.messageServiceExt.addMessage('error','Błąd',"Status: " + error.status + ' ' + error.statusText);

        });

    }
  }

  showSuccessMassage() {
    this.messageServiceExt.addMessage('success','Status','Poprawnie dodano adres do klienta');
  }


  ZipCodeUtil(zipCode: string) {

    if (this.el.valid) {
      this.pickCityByZipCodeWindow = true;
      this.customerService.getCityByZipCode(zipCode).subscribe(data => {
        data.forEach((value) => {
          this.tmpCityList.push(value.zipCode.city);

        });
      })
    }
    ;

  }

  clearOnCloseDialog() {
    this.tmpCityList = [];
    this.formSubmitted = false;
  }

  clearOnCloseChangeMainAddressDialog() {
    this.selectedAddr= null;
  }

  selectCity(city: string) {
    this.addressToAdd.cityName = city;
    this.tmpCityList = [];
    this.pickCityByZipCodeWindow = false;
  }

  cancelAddAddr() {
    this.addAddressDialogShow = false;
    this.addressToAdd = new Address();
    this.formSubmitted = false;
  }

  refreshAddressesList(){
    this.customerService.getCustomer(this.customer.customerId).subscribe(data => {
        data.addresses.sort(this.compareAddress);
        this.customer = data;

    })
  }


  showDeleteConfirmWindow(addrId : number, customerId : number) {

    this.confirmationService.confirm({

      message: 'Jesteś pewny że chcesz usunąć ten adres',

      accept: () => {

          this.customerService.deleteAddress(addrId,customerId).subscribe(
              data => {
                  this.refreshAddressesList();
                  this.messageServiceExt.addMessage('success','Status','Usunięto adres');
              },
              error =>{

                  this.messageServiceExt.addMessage('error','Błąd',error.text());

              });

      },
      reject: () => {

      }
    });

  }

  changePrimaryAddr(custId : number, addrId : number){

    console.log(custId + " "+ addrId)

      this.customerService.changeMainAddr(custId,addrId).subscribe(data=>{
             this.messageServiceExt.addMessage('success','Status','Zmieniono główny addres');
             this.changeMainAddressDialogShow = false;
             this.selectedAddr = null;
             this.refreshAddressesList();
      },
          error =>{

            this.messageServiceExt.addMessage('error','Błąd','Błąd');

          });

  }

}
