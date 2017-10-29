import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Order} from '../model/order.model';
import {OrderService} from './order.service';
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/primeng";

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class OrderComponent implements OnInit {
    public loading: boolean= false;
    public orders: Order[]=[];

    constructor(private orderService :OrderService,private router: Router,private confirmationService: ConfirmationService) {
        orderService.getOrders().subscribe(data=> this.orders=data);

    }

    refreshData() {
        this.loading = true;
        setTimeout(() => {
            this.orderService.getOrders().subscribe(data=> this.orders=data);
            this.loading = false;
        }, 1000);
        console.log(this.orders);
    }

    ngOnInit() {
    }

    printPdf(id : number){
        this.orderService.getPdf(id).subscribe(res=>{
           var fileURL = URL.createObjectURL(res);
           window.open(fileURL);

            }
        )
    }

    ShowConfirmModal(order: Order) {
        this.confirmationService.confirm({
            message: 'Jesteś pewny że chcesz usunąć zamówienie nr:  ' + order.orderId + ' do kosza ?',
            accept: () => {
                order.orderStatus.orderStatusId=99;
                this.orderService.saveOrder(order).subscribe(data =>{

                this.refreshData();
                } )

            },
            reject:()=>{

            }
        });
    }

}