import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BasketItems} from '../../model/basket_items.model';
import {Basket} from '../../model/basket.model';
import {OrderItem} from '../../model/order_item';
import {BasketService} from '../gift-basket.service';
import {Customer} from '../../model/customer.model';
import {CustomerService} from './customer.service';

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
    private selectedCustomer: Customer;
    private total: number = 0;
    public PopUpBackgroundStyle = {
        'dark_background': false,
    }



    constructor(private basketService : BasketService, private  customerService: CustomerService) {
        basketService.getBaskets().subscribe(data=> this.baskets = data);
        customerService.getCustomers().subscribe(data=> this.customers = data);
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

    getCustomersList(){
        this.customerService.getCustomers().subscribe(data=> this.customers = data);
    }
    pickCustomer(customer : Customer){
        this.selectedCustomer = customer;
        console.log(JSON.stringify(this.selectedCustomer))

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