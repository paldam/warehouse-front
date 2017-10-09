import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BasketItems} from '../../model/basket_items.model';
import {Basket} from '../../model/basket.model';
import {OrderItem} from '../../model/order_item';
import {BasketService} from '../gift-basket.service';
import {Customer} from '../../model/customer.model';
import {CustomerService} from './customer.service';
import {NgForm} from '@angular/forms';
import {Order} from '../../model/order.model';
import {OrderService} from '../../order/order.service';
import {DeliveryType} from '../../model/delivery_type.model';

@Component({
    selector: 'basket-order',
    templateUrl: './basket-order.component.html',
    styleUrls: ['./basket-order.component.css'],
    encapsulation: ViewEncapsulation.None

})

export class BasketOrderComponent implements OnInit {
    private orderItems: OrderItem[]=[];
    private baskets: Basket[]=[];
    private customers: Customer[]=[];
    private deliveryTypes: DeliveryType[]=[];
    private selectedCustomer: Customer = new Customer();
    private order: Order = new Order();
    private total: number = 0;
    private formSubmitted: boolean = false;
    private isReadOnlyProp: boolean = false;
    public PopUpBackgroundStyle = {
        'dark_background': false,
    }



    constructor(private basketService : BasketService, private  customerService: CustomerService, private orderService: OrderService) {
        basketService.getBaskets().subscribe(data=> this.baskets = data);
        customerService.getCustomers().subscribe(data=> this.customers = data);
        orderService.getDeliveryTypes().subscribe(data=> this.deliveryTypes = data);
    }

    ngOnInit() {
    }

    addBasketToOrder(basket: Basket){
        let line = this.orderItems.find(data => data.basket.basketId == basket.basketId );

        if (line == undefined) {
            this.orderItems.push(new OrderItem(basket,1))
        }else{
            line.quantity= line.quantity + 1;
        }
        this.recalculate();
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
    }

    recalculate(){
        this.total = 0;
        this.orderItems.forEach(data=> {
            this.total += data.basket.basketTotalPrice * data.quantity;
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

        if (form.valid && formAdidtional.valid) {
            this.order.orderItems = this.orderItems;
            this.order.customer = this.selectedCustomer;

            console.log(JSON.stringify(this.order));

            this.orderService.saveOrder(this.order).subscribe(data=>{
                    this.order=new Order();
                    this.selectedCustomer= new Customer();
                    this.orderItems=[];
                    this.isReadOnlyProp= false;
                    form.resetForm();
                    formAdidtional.resetForm();
                    this.recalculate();
                    this.formSubmitted = false;
                //         this.giftBasketComponent.refreshData();
                    },
                    err =>  console.log("error " ));
            }

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