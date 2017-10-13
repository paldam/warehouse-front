import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Order} from '../model/order.model';
import {OrderService} from './order.service';

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class OrderComponent implements OnInit {
    public loading: boolean= false;
    public orders: Order[]=[];

    constructor(private orderService :OrderService) {
        orderService.getOreders().subscribe(data=> this.orders=data);
    }

    refreshData() {
        this.loading = true;
        setTimeout(() => {
            this.orderService.getOreders().subscribe(data=> this.orders=data);
            this.loading = false;
        }, 1000);
    }

    ngOnInit() {
    }
}