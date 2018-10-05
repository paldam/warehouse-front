import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Basket} from '../../model/basket.model';
import {OrderItem} from '../../model/order_item';
import {BasketService} from '../../basket/basket.service';
import {Customer} from '../../model/customer.model';
import {CustomerService} from '../../customer/customer.service';
import {NgForm} from '@angular/forms';
import {Order} from '../../model/order.model';
import {OrderService} from '../order.service';
import {DeliveryType} from '../../model/delivery_type.model';
import {OrderStatus} from "../../model/OrderStatus";
import {ConfirmationService, FileUpload} from "primeng/primeng";
import {AuthenticationService, TOKEN, TOKEN_USER} from "../../authentication.service";
import {ContextMenuModule,MenuItem,ContextMenu} from 'primeng/primeng';
import {Router} from "@angular/router";
import {Address} from "../../model/address.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'basket-order',
    templateUrl: './basket-order.component.html',
    styleUrls: ['./basket-order.component.css'],
   encapsulation: ViewEncapsulation.None

})

export class BasketOrderComponent implements OnInit {
    public orderItems: OrderItem[]=[];
    public baskets: Basket[]=[];
    public customers: Customer[]=[];
    public customerAddress: Address = new Address();
    public deliveryTypes: DeliveryType[]=[];
    public deliveryType: DeliveryType= new DeliveryType();
    public selectedCustomer: Customer = new Customer();
    public selectedCustomerAddress: Address = new Address();
    public order: Order = new Order();
    public total: number = 0;
    public formSubmitted: boolean = false;
    public formAddAdrrSubmitted: boolean = false;
    public isAddressesOptionVisable = false;
    public isReadOnlyProp: boolean = false;
    public addAddressDialogShow: boolean = false;
    public addressToAdd: Address = new Address();
    public storedCustomerMode: boolean = false;
    public loading: boolean;
    public confirmDialogShow: boolean = false;
    public customerPickDialogShow: boolean = false;
    public generatedOrderId: number = null; //id too print PDF
    public items: MenuItem[];
    public tmpCityList: any[] = [];
    public pickCityByZipCodeWindow: boolean = false;


    public selectedBasketOnContextMenu: Basket = new Basket();
    public addrs: Address[]=[];
    @ViewChild(FileUpload) fileUploadElement: FileUpload;
    @ViewChild('zip_code') el: any;
    @ViewChild('address2') storedCustomerAddressList: any;
    value: Date;
    dateLang: any;


    constructor(private router : Router,private basketService : BasketService, private  customerService: CustomerService,
                private orderService: OrderService,private messageServiceExt: MessageServiceExt,private confirmationService: ConfirmationService,private authenticationService: AuthenticationService) {
        basketService.getBaskets().subscribe(data=> this.baskets = data);
        customerService.getCustomers().subscribe(data=> this.customers = data);
        orderService.getDeliveryTypes().subscribe(data=> this.deliveryTypes = data);
        this.order.deliveryType = new DeliveryType();


    }

    ngOnInit() {
        this.dateLang = {
            firstDayOfWeek: 0,
            dayNames: ["Sobota", "Poniedziałek", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
            dayNamesMin: ["Nd","Po","Wt","Śr","Cz","Pi","So"],
            monthNames: [ "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień" ],
            monthNamesShort: [ "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze","Lip", "Sie", "Wrz", "Paź", "Lis", "Gru" ],
            today: 'Dzisiaj',
            clear: 'czyść'
        };

        this.items = [
            {label: 'Dodaj kosz', icon: 'fa fa-plus',command: (event) => this.addBasketToOrder(this.selectedBasketOnContextMenu)},
        ];


    }
    ngAfterViewInit(): void{
            $(document).ready(function(){
            $( function() {
                $( "#datepicker" ).datepicker({
                    dateFormat: "dd.mm.yy"
                });
            } );
        })
    }

    showAddAddressWindow() {
        this.addAddressDialogShow = true;

    }
    contextMenuSelected(event){
        this.selectedBasketOnContextMenu = event.data;
    }
    addBasketToOrder(basket: Basket){
        let line = this.orderItems.find(data => data.basket.basketId == basket.basketId );

        if (line == undefined) {
            this.orderItems.push(new OrderItem(basket,1))
        }else{
            line.quantity= line.quantity + 1;
        }
        this.recalculate();
        // this.recalculateTotalPlusMarkUp();
    }
    updateQuantity(basketLine: OrderItem, quantity: number) {
        let line = this.orderItems.find(line => line.basket.basketId== basketLine.basket.basketId);
        if (line != undefined) {
            line.quantity = Number(quantity);
        }
        this.recalculate();
        // this.recalculateTotalPlusMarkUp();
    }

    isBasketLinesEmpty() : boolean{
        if (this.orderItems.length == 0) {
            return true
        } else {
            return false
        }
    }
    deleteProductLine(id : number){

        let index = this.orderItems.findIndex(data=> data.basket.basketId == id);
        if (index > -1){
            this.orderItems.splice(index,1);
        }
        this.recalculate();
    }


    recalculate(){
        this.total = 0;
        this.orderItems.forEach(orderItem=> {
            this.total += (orderItem.basket.basketTotalPrice * orderItem.quantity);
            })

    }

    isFormReadOnly() : boolean{
        return this.isReadOnlyProp;
    }


    pickCustomer(customer : Customer){
        this.selectedCustomer = customer;
        this.isReadOnlyProp= true;
        this.customerPickDialogShow = false;
        console.log(this.selectedCustomer.addresses);

    }

    isAdmin() : boolean {
        return this.authenticationService.isAdmin();
    }

    showCustomerList() {
        this.addressToAdd.cityName = null;
        this.customerPickDialogShow = true;
        this.isAddressesOptionVisable = true;
        this.storedCustomerMode = true;

        this.customers.forEach(data=>{
            console.log(data)
        })
    }
    cleanForm(form : NgForm, formAdidtional : NgForm){
        form.resetForm();
        this.storedCustomerMode=false;
        formAdidtional.resetForm();
        this.order= new Order();
        this.selectedCustomer= new Customer();
        this.addressToAdd.cityName = null;
        this.addressToAdd.zipCode = null;
        this.isReadOnlyProp= false;
        this.formSubmitted = false;
        this.isAddressesOptionVisable = false;
        this.customerService.getCustomers().subscribe(data=> this.customers = data);
    }

    submitOrderForm(form: NgForm, formAdidtional: NgForm) {
        this.formSubmitted = true;
       // consthis.storedCustomerAddressList.model
        if (form.valid && formAdidtional.valid && this.orderItems.length>0) {
            this.setUpOrderBeforeSave();

            this.orderService.saveOrder(this.order).subscribe(data=>{

                    this.generatedOrderId  = data.orderId;
                    this.cleanAfterSave(form,formAdidtional);
                    this.recalculate();

                    this.fileUploadElement.url = "http://www.kosze.ovh:8080/uploadfiles?orderId="+ data.orderId;
                    this.fileUploadElement.upload();


                    this.showAddOrderConfirmModal();

                    this.customerService.getCustomers().subscribe(data=> this.customers = data);

                    },
                error =>  {
                        this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);

                    }
            );
        }
    }

    setUpOrderBeforeSave(){
        this.order.orderTotalAmount = this.total;
        this.order.orderItems = this.orderItems;





        this.order.customer = this.selectedCustomer;

        this.order.customer.addresses = [];
        this.selectedCustomerAddress.isPrimaryAddress=1;
        this.order.customer.addresses.push(this.selectedCustomerAddress);

        if (this.order.deliveryType.deliveryTypeId == 5 || this.order.deliveryType.deliveryTypeId == 6 || this.order.deliveryType.deliveryTypeId == 7 ){
            this.order.cod *=100;
        }else{
            this.order.cod =0;
        }

        this.order.orderStatus = new OrderStatus(1);
        this.order.userName = localStorage.getItem(TOKEN_USER);
    }

    cleanAfterSave(form: NgForm, formAdidtional: NgForm){
        this.formSubmitted = false;
        this.selectedCustomer= new Customer();

        this.orderItems=[];
        this.isReadOnlyProp= false;
        form.resetForm();
        formAdidtional.resetForm();
        this.isAddressesOptionVisable = false;
        this.storedCustomerMode = false;
        this.selectedCustomer.addresses=[];
    }

    printPdf() {
        this.orderService.getPdf(this.generatedOrderId).subscribe(res => {
            var fileURL = URL.createObjectURL(res);
            window.open(fileURL);
        })

        this.generatedOrderId = null;
    }

    showAddOrderConfirmModal() {
        this.confirmDialogShow = true;
    }

    hideAddOrderConfirmModal() {
        this.confirmDialogShow = false;
    }

    cancelCreateOrder(){
        this.router.navigateByUrl('/orders');
    }
    onShowPopUp(){

        this.customerService.getCustomers().subscribe(data=> this.customers = data);
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

    selectCity(city: string) {
        this.addressToAdd.cityName = city;
        this.selectedCustomerAddress.cityName = city;
        this.tmpCityList = [];
        this.pickCityByZipCodeWindow = false;
    }


    submitAddAddresForm(form: NgForm) {
        this.formAddAdrrSubmitted = true;
        if (form.valid) {
            this.selectedCustomer.addresses.push(this.addressToAdd);

            this.customerService.saveCustomers(this.selectedCustomer).subscribe(data => {

                this.addAddressDialogShow = false;
                form.reset();
                this.formAddAdrrSubmitted  = false;
                this.showSuccessMassage();

                this.customerService.getCustomer(this.selectedCustomer.customerId).subscribe(data => {
                    this.selectedCustomer = data;
                })

            }, error => {

                this.messageServiceExt.addMessage('error','Błąd',"Status: " + error.status + ' ' + error.statusText);

            });

        }
    }

    showSuccessMassage() {
        this.messageServiceExt.addMessage('success','Status','Poprawnie dodano adres do klienta');
    }

    clearOnCloseDialog() {
        this.tmpCityList = [];
        this.formAddAdrrSubmitted = false;
    }
    cancelAddAddr(){
        this.addAddressDialogShow=false;
        this.addressToAdd.cityName = null;
        this.addressToAdd.zipCode =null;
        this.selectedCustomerAddress.zipCode = null;
        this.selectedCustomerAddress.cityName = null;
    }

    onBeforeUpload(event){
        let token = localStorage.getItem(TOKEN);
        event.xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    }
    // setPopUpDarkBackgroudTrue(){
    //     this.PopUpBackgroundStyle= {
    //         'dark_background': true,
    //     }
    // }
    //
    // setPopUpDarkBackgroudFalse(){
    //     this.PopUpBackgroundStyle= {
    //         'dark_background': false,
    //     }
    // }
}