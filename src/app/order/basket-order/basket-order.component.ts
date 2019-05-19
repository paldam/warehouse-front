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
import {Company} from "../../model/company.model";

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'basket-order',
    templateUrl: './basket-order.component.html',
    styleUrls: ['./basket-order.component.css'],
   encapsulation: ViewEncapsulation.None

})

export class BasketOrderComponent implements OnInit {


    public customerEntryDataType : CustomerEntryDataType = 0;
    public company: Company = new Company();
    public customers: Customer[]=[];
    //public customerAddress: Address = new Address();
    public customer: Customer = new Customer();
    public customerAddress: Address = new Address();
    public addressToAdd: Address = new Address();
    public companyList: any[]=[];




    public order: Order = new Order();
    public total: number = 0;
    public formSubmitted: boolean = false;
    public formAddAdrrSubmitted: boolean = false;
    public isAddressesOptionVisable = false;
    public isReadOnlyProp: boolean = false;
    public addAddressDialogShow: boolean = false;

    public deliveryTypes: DeliveryType[]=[];
    public deliveryType: DeliveryType= new DeliveryType();


    public orderItems: OrderItem[]=[];
    public baskets: Basket[]=[];

    public loading: boolean;
    public confirmDialogShow: boolean = false;
    public customerPickDialogShow: boolean = false;
    public companyPickDialogShow: boolean = false;
    public generatedOrderId: number = null; //id too print PDF
    public items: MenuItem[];
    public tmpCityList: any[] = [];
    public pickCityByZipCodeWindow: boolean = false;
    public weekOfYearTmp: Date;
    public weekOfYear: number;
    public isDeliveryDateValid: boolean = true;
    public isDeliveryWeekDateValid: boolean = true;


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
        orderService.getCompany().subscribe(data => this.companyList = data );
        orderService.getDeliveryTypes().subscribe(data=> this.deliveryTypes = data);



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

        this.customer.company = null;

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




    changeCompanyPickerMode(event) {

        console.log(event.target.value);

        switch (event.target.value) {
            case "0" :
                this.customerEntryDataType = 0;
                break;
            case "1" :
                this.customerEntryDataType = 1;
                break;
            case "2" :
                this.customerEntryDataType = 2;
                break;
        }
        
        console.log(this.customerEntryDataType);

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
        this.customer = customer;
        this.isReadOnlyProp= true;
        this.customerPickDialogShow = false;
        console.log(this.customer.addresses);

    }

    pickCompany(event){
        this.company = event;
        this.companyPickDialogShow = false;
    }

    isAdmin() : boolean {
        return this.authenticationService.isAdmin();
    }

    showCustomerList() {
        this.addressToAdd.cityName = null;
        this.customerPickDialogShow = true;
        this.isAddressesOptionVisable = true;
        //this.storedCustomerMode = true;

        this.customers.forEach(data=>{
            console.log(data)
        })
    }

    showCompanyList() {

        this.companyPickDialogShow = true;


    }


    cleanForm(form : NgForm, formAdidtional : NgForm){
        form.resetForm();
        this.customerEntryDataType = 0;
        formAdidtional.resetForm();
        this.order= new Order();
        this.customer= new Customer();
        this.addressToAdd.cityName = null;
        this.addressToAdd.zipCode = null;
        this.isReadOnlyProp= false;
        this.formSubmitted = false;
        this.isAddressesOptionVisable = false;
        this.customerService.getCustomers().subscribe(data=> this.customers = data);
    }

    submitOrderForm(form: NgForm, formAdidtional: NgForm) {

        this.formSubmitted = true;

        if (this.isAllDataValid(form,formAdidtional)) {
            this.setUpOrderBeforeSave();

            this.orderService.saveOrder(this.order).subscribe(
                data=>{

                        this.generatedOrderId  = data.orderId;
                        this.fileUploadElement.url = "http://www.kosze.ovh:8080/uploadfiles?orderId="+ data.orderId;
                        this.fileUploadElement.upload();
                        console.log(this.order);

                    },
                error =>  {
                        this.messageServiceExt.addMessage('error', 'Błąd', "Status: " + error.status + ' ' + error.statusText);
                    },
                () => {
                        this.recalculate();
                        this.showAddOrderConfirmModal();
                        this.cleanAfterSave(form,formAdidtional);
                        this.customerService.getCustomers().subscribe(data=> this.customers = data)
                    }
            );
        }
    }


    private isAllDataValid(form: NgForm, formAdidtional: NgForm): boolean{

        return (form.valid && formAdidtional.valid && this.orderItems.length>0  && this.isDeliveryDateValid && this.isDeliveryWeekDateValid);
    }



   private setUpOrderBeforeSave(){
        this.order.orderTotalAmount = this.total;
        this.order.orderItems = this.orderItems;
        this.order.additionalSale = 0;


        this.order.customer = this.customer;
        this.order.customer.company = this.company;
       this.order.customer.addresses = [];

        this.order.customer.addresses[0]= this.customerAddress;




        if (this.order.deliveryType.deliveryTypeId == 5 || this.order.deliveryType.deliveryTypeId == 6 || this.order.deliveryType.deliveryTypeId == 7 ){
            this.order.cod *=100;
        }else{
            this.order.cod =0;
        }

        this.order.orderStatus = new OrderStatus(1);
        this.order.userName = localStorage.getItem(TOKEN_USER);

        this.order.weekOfYear = this.getWeekNumber(this.weekOfYearTmp);
    }


    cleanAfterSave(form: NgForm, formAdidtional: NgForm){
        this.formSubmitted = false;
        this.customer= new Customer();

        this.orderItems=[];
        this.isReadOnlyProp= false;
        form.resetForm();
        formAdidtional.resetForm();
        this.isAddressesOptionVisable = false;
        this.customerEntryDataType = 0;
        this.customer.addresses=[];
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
        this.customerAddress.cityName = city;
        this.tmpCityList = [];
        this.pickCityByZipCodeWindow = false;
    }


    submitAddAddresForm(form: NgForm) {
        this.formAddAdrrSubmitted = true;
        if (form.valid) {
            this.customer.addresses.push(this.addressToAdd);

            this.customerService.saveCustomers(this.customer).subscribe(data => {

                this.addAddressDialogShow = false;
                form.reset();
                this.formAddAdrrSubmitted  = false;
                this.showSuccessMassage();

                this.customerService.getCustomer(this.customer.customerId).subscribe(data => {
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

    clearOnCloseDialog() {
        this.tmpCityList = [];
        this.formAddAdrrSubmitted = false;
    }
    cancelAddAddr(){
        this.addAddressDialogShow=false;
        this.addressToAdd.cityName = null;
        this.addressToAdd.zipCode =null;
        this.customerAddress.zipCode = null;
        this.customerAddress.cityName = null;
    }

    onBeforeUpload(event){
        let token = localStorage.getItem(TOKEN);
        event.xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    }



    getWeekNumber(d: Date): number {
        d = new Date(d);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
        return weekNo
    }

    OnWeekOfYearDateChange(){

        this.weekOfYear = this.getWeekNumber(this.weekOfYearTmp);
        this.isDeliveryWeekValid();

    }

    closeCustomerPicker(){

        if(this.customer.name == null){
            //this.storedCustomerMode=false;
            this.isAddressesOptionVisable = false;
        }

    }

    isDeliveryWeekValid(){

        let weekOfYearFromNowDate = this.getWeekNumber(new Date());

        if(weekOfYearFromNowDate > this.weekOfYear){
            this.isDeliveryWeekDateValid = false
        }else {
            this.isDeliveryWeekDateValid = true
        }
        console.log(this.isDeliveryWeekDateValid);
    }


    onDeliveryDataChange() {

        var tmpDeliveryDate = new Date(this.order.deliveryDate);

        tmpDeliveryDate.setHours(23, 59, 59, 99);

        let now = new Date();

        console.log(now.getTime());

        if (tmpDeliveryDate.getTime() > now.getTime()) {
            this.isDeliveryDateValid = true
        } else {
            this.isDeliveryDateValid = false
        }


    }

    compareDeliveryType( optionOne : DeliveryType, optionTwo : DeliveryType) : boolean {
        return optionTwo && optionTwo ? optionOne.deliveryTypeId === optionTwo.deliveryTypeId :optionOne === optionTwo;
    }
}