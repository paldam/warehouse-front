import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Basket} from '../../model/basket.model';
import {OrderItem} from '../../model/order_item';
import {BasketService} from '../gift-basket.service';
import {Customer} from '../../model/customer.model';
import {CustomerService} from './customer.service';
import {NgForm} from '@angular/forms';
import {Order} from '../../model/order.model';
import {OrderService} from '../../order/order.service';
import {DeliveryType} from '../../model/delivery_type.model';
import {OrderStatus} from "../../model/OrderStatus";
import {ConfirmationService} from "primeng/primeng";
import {TOKEN_USER} from "../../authentication.service";
import {ContextMenuModule,MenuItem,ContextMenu} from 'primeng/primeng';

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
    public deliveryTypes: DeliveryType[]=[];
    public deliveryType: DeliveryType= new DeliveryType();
    public selectedCustomer: Customer = new Customer();
    public order: Order = new Order();
    public total: number = 0;
    public formSubmitted: boolean = false;
    public isReadOnlyProp: boolean = false;
    public loading: boolean;
    // public totalPlusMarkUp: number=0;
    // public markupPercent: number = 10;
    // public markupConst: number=0;
    // public markUpOption: number =1;
    // public IsMarkUpConstActive: boolean= false;
    // public IsMarkUpPercentActive: boolean= true;
    public confirmDialogShow: boolean = false;
    public generatedOrderId: number = null; //id too print PDF
    public PopUpBackgroundStyle = {
        'dark_background': false,
    }
    value: Date;
    dateLang: any;

    private items: MenuItem[];
    public selectedBasketOnContextMenu: Basket = new Basket();

    constructor(private basketService : BasketService, private  customerService: CustomerService, private orderService: OrderService,private confirmationService: ConfirmationService) {
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

    // recalculateTotalPlusMarkUp(){
    //     if (this.markUpOption ==0 ){
    //         this.totalPlusMarkUp = this.total * ((this.markupPercent/100)+1)
    //     }else{
    //         this.totalPlusMarkUp = this.total + (this.markupConst*100);
    //     }
    // }

    // updateMarkupOption(event) {
    //     if(event.target.value==0){
    //         this.totalPlusMarkUp = this.total * ((this.markupPercent/100)+1)
    //         this.markUpOption=0;
    //         this.IsMarkUpConstActive= true;
    //         this.IsMarkUpPercentActive= false;
    //     }else{
    //         this.totalPlusMarkUp = this.total + this.markupConst;
    //         this.markUpOption=1;
    //         this.IsMarkUpConstActive= false;
    //         this.IsMarkUpPercentActive= true;
    //     }
    //
    // }

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
        // this.recalculateTotalPlusMarkUp();
    }


    // recalculate(){
    //     this.total = 0;
    //     this.orderItems.forEach(orderItem=> {
    //         let totalBasketPrice =0;
    //         orderItem.basket.basketItems.forEach(basketItem=>{
    //             totalBasketPrice+=(basketItem.product.price * basketItem.quantity)
    //         })
    //         this.total += (totalBasketPrice * orderItem.quantity);
    //     })
    // }

    recalculate(){
        this.total = 0;
        this.orderItems.forEach(orderItem=> {
            this.total += (orderItem.basket.basketTotalPrice * orderItem.quantity);
            })

    }

    isFormReadOnly() : boolean{
        return this.isReadOnlyProp;
    }
    getCustomersList(){
        this.customerService.getCustomers().subscribe(data=> this.customers = data);
    }

    pickCustomer(customer : Customer){
        this.selectedCustomer = customer;
        this.isReadOnlyProp= true;


    }
    cleanForm(form : NgForm, formAdidtional : NgForm){
        form.resetForm();
        formAdidtional.resetForm();
        this.order= new Order();
        this.selectedCustomer= new Customer();
        this.isReadOnlyProp= false;
        this.formSubmitted = false;
    }

    submitOrderForm(form: NgForm, formAdidtional: NgForm) {
        this.formSubmitted = true;
        console.log(JSON.stringify(this.order));
        if (form.valid && formAdidtional.valid && this.orderItems.length>0) {
            this.setUpOrderBeforeSave();
            console.log(JSON.stringify(this.order));
            this.orderService.saveOrder(this.order).subscribe(data=>{
                    this.generatedOrderId  = data.orderId;
                    this.cleanAfterSave(form,formAdidtional);
                    this.recalculate();
                    this.showAddOrderConfirmModal();

                    },
                    err =>  {
                     console.log("Wystąpił błąd " );
                    }
            );
        }
    }

    setUpOrderBeforeSave(){
        this.order.orderTotalAmount = this.total;
        this.order.orderItems = this.orderItems;
        this.order.customer = this.selectedCustomer;

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
        // this.totalPlusMarkUp=0;
        form.resetForm();
        formAdidtional.resetForm();
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


    onShowPopUp(){
        this.setPopUpDarkBackgroudTrue();
        this.customerService.getCustomers().subscribe(data=> this.customers = data);
    }

    setPopUpDarkBackgroudTrue(){
        this.PopUpBackgroundStyle= {
            'dark_background': true,
        }
    }

    setPopUpDarkBackgroudFalse(){
        this.PopUpBackgroundStyle= {
            'dark_background': false,
        }
    }
}