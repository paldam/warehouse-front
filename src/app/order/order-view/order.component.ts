import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Order} from '../../model/order.model';
import {OrderService} from '../order.service';
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {ConfirmationService} from "primeng/primeng";
import {AuthenticationService} from "../../authentication.service";
import {filter, pairwise} from "rxjs/internal/operators";
import {FileSendService} from "../../file-send/file-send.service";
import {OrderItem} from "../../model/order_item";

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class OrderComponent implements OnInit {
    public loading: boolean= false;
    public orders: any[]=[];
    public lastVisitedPageOrder: number ;
    public findInputtextOrder: string = "";
    public isCurrentPageCustomerEdit : boolean = false;
    public currentCustomerOnCustomerEditPage : number;
    public SelectedRowOrderItems: OrderItem[]=[];
    @ViewChild('onlyWithAttach') el:ElementRef;

    constructor(private orderService :OrderService,private router: Router,private confirmationService: ConfirmationService,
                private authenticationService: AuthenticationService, activeRoute: ActivatedRoute, fileSendService :FileSendService) {

        this.isCurrentPageCustomerEdit = router.url.substring(0, 9) == "/customer";


        if (this.isCurrentPageCustomerEdit) {
            orderService.getOrderByCustomer(activeRoute.snapshot.params["id"]).subscribe(data => {
                this.orders = data;
                this.currentCustomerOnCustomerEditPage = activeRoute.snapshot.params["id"];
            })



        } else {
            orderService.getOrdersDto().subscribe(data => this.orders = data);
        }

        this.router.events
            .pipe(filter((e: any) => e instanceof RoutesRecognized),
                pairwise()
            ).subscribe((e: any) => {
            let previousUrlTmp = e[0].urlAfterRedirects;

            if (previousUrlTmp.search('/order') == -1) {
                localStorage.removeItem('findInputtextOrder');
                localStorage.removeItem('lastPageOrder');
            } else {
            }

        });


        if (localStorage.getItem('findInputtextOrder')) {
            this.findInputtextOrder = (localStorage.getItem('findInputtextOrder'));
        } else {
            this.findInputtextOrder = "";
        }



    }

    refreshData() {

        console.log(JSON.stringify(this.orders));


        this.loading = true;
        setTimeout(() => {
            if(this.isCurrentPageCustomerEdit){
                this.orderService.getOrderByCustomer(this.currentCustomerOnCustomerEditPage).subscribe(data=> this.orders=data);

            }else{
                this.orderService.getOrdersDto().subscribe(data=> this.orders=data);
            }

            this.loading = false;
        }, 1000);
    }

    ngOnInit() {


        setTimeout(() => {
        if (localStorage.getItem('lastPageOrder')){
            let tmplastVisitedPage =parseInt(localStorage.getItem('lastPageOrder'));
            this.lastVisitedPageOrder = (tmplastVisitedPage -1)*20;
        }else{
            this.lastVisitedPageOrder = 0;
        }
        }, 300);

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

    printConfirmationPdf(id : number){
        this.orderService.getConfirmationPdf(id).subscribe(res=>{
                var fileURL = URL.createObjectURL(res);
                window.open(fileURL);

            }
        )
    }

    ShowConfirmModal(order: Order) {

        console.log(order.orderStatus.orderStatusId);


        if (order.orderStatus.orderStatusId == 1){

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

        } else{
            this.confirmationService.confirm({
                message: 'Uwaga Jesteś pewny że chcesz trwale usunąć zamówienie nr:  ' + order.orderId + ' . Po tej operacji nie będzie możliwości odtworzenia danego zamówienia i jego pozycji',
                accept: () => {

                    this.orderService.deleteOrder(order.orderId).subscribe(data =>{

                        this.refreshData();
                    } )

                },
                reject:()=>{

                }
            });
        }

    }

    calculateStyles(a : any){
        if(a=='usunięte'){
            return {'color': 'red'};
        }else{
            return {'color': 'black'};
        }

    }

    clickOnlyWithAtttach(){

        if (this.el.nativeElement.checked){

             let fillteredOrderList =   this.orders.filter(function(data){
                    return data.dbFileId > 0;
                });
                this.orders = fillteredOrderList;


        }else{
            this.orderService.getOrdersDto().subscribe(data => this.orders = data);
        }

    }

    rowExpand(event){


        this.orderService.getOrder(event.data.orderId).subscribe(data=>{
            this.SelectedRowOrderItems = data.orderItems;
        })

    }

}