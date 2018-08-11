import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Order} from '../model/order.model';
import {OrderService} from './order.service';
import {Router, RoutesRecognized} from "@angular/router";
import {ConfirmationService} from "primeng/primeng";
import {AuthenticationService} from "../authentication.service";
import {filter, pairwise} from "rxjs/internal/operators";

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class OrderComponent implements OnInit {
    public loading: boolean= false;
    public orders: Order[]=[];
    public lastVisitedPageOrder: number ;
    public findInputtextOrder: string = "";

    constructor(private orderService :OrderService,private router: Router,private confirmationService: ConfirmationService, private authenticationService: AuthenticationService) {
        orderService.getOrders().subscribe(data=> this.orders=data);
        this.router.events
            .pipe(filter((e: any) => e instanceof RoutesRecognized),
                pairwise()
            ).subscribe((e: any) => {
            let previousUrlTmp = e[0].urlAfterRedirects ;

            if (previousUrlTmp.search('/order')==-1) {
                localStorage.removeItem('findInputtextOrder');
            }else{
            }

        });


        if (localStorage.getItem('findInputtextOrder')){
            this.findInputtextOrder = (localStorage.getItem('findInputtextOrder'));
        }else{
            this.findInputtextOrder = "";
        }
    }

    refreshData() {
        this.loading = true;
        setTimeout(() => {
            this.orderService.getOrders().subscribe(data=> this.orders=data);
            this.loading = false;
        }, 1000);
    }

    ngOnInit() {

        if (localStorage.getItem('lastPageOrder')){
            let tmplastVisitedPage =parseInt(localStorage.getItem('lastPageOrder'));
            this.lastVisitedPageOrder = (tmplastVisitedPage -1)*20;
        }else{
            this.lastVisitedPageOrder = 0;
        }
    }

    goToEditPage(index,id) {

        let pageTmp = ((index-1) / 20)+1;
        localStorage.setItem('lastPageOrder', pageTmp.toString());
        let textTmp = this.findInputtextOrder;
        localStorage.setItem('findInputtextOrder', textTmp);
        this.router.navigate(["/order/",id]);
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