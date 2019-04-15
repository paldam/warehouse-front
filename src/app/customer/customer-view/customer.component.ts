import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CustomerService} from "../customer.service";
import {Customer} from "../../model/customer.model";
import {OrderService} from "../../order/order.service";
import {Order} from "../../model/order.model";
import {MessageServiceExt} from "../../messages/messageServiceExt";
import {ConfirmationService} from "primeng/api";
import {AuthenticationService} from "../../authentication.service";
import {AppConstans} from "../../constans";
import {Router} from "@angular/router";
import {RoutingState} from "../../routing-stage";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerComponent implements OnInit {

  public loading: boolean= false;
  public customersList :any[]=[];
  public allOrdersByCustomerList : Order[] = [];
    public findInputTextOnCustomerViewPage: string = "";
    public lastPaginationPageNumberOnCustomerViewPage: number ;
  public selectedValue: any ;
    public paginatorValues = AppConstans.PAGINATOR_VALUES;

  constructor(private customerService :CustomerService, private  orderService: OrderService,private messageServiceExt: MessageServiceExt,
              private confirmationService : ConfirmationService, private authenticationService :AuthenticationService, public router :Router,private routingState :RoutingState) {


      this.setSearchOptions();

    customerService.getAllCustomerWithPrimaryAddress().subscribe(data=>{
      this.customersList = data;
    })

  }

  ngOnInit() {
  }


  refreshData(){
    this.loading = true;
    setTimeout(() => {
      this.customerService.getCustomers().subscribe(data=>{
        this.customersList = data;
        });
      this.loading = false;
    }, 1000);

  }


    setSearchOptions() {

        let previousUrlTmp = this.routingState.getPreviousUrl();


        if (previousUrlTmp.search('/customer') == -1) {
            localStorage.removeItem('findInputTextOnCustomerViewPage');
            localStorage.removeItem('lastPaginationPageNumberOnOrderViewPage');
        } else {
        }


        if (localStorage.getItem('findInputTextOnCustomerViewPage')) {
            this.findInputTextOnCustomerViewPage = (localStorage.getItem('findInputTextOnCustomerViewPage'));
        } else {
            this.findInputTextOnCustomerViewPage = "";
        }


        setTimeout(() => {
            if (localStorage.getItem('lastPaginationPageNumberOnCustomerViewPage')) {
                let tmplastVisitedPage = parseInt(localStorage.getItem('lastPaginationPageNumberOnCustomerViewPage'));
                this.lastPaginationPageNumberOnCustomerViewPage = (tmplastVisitedPage - 1) * 20;
            } else {
                this.lastPaginationPageNumberOnCustomerViewPage = 0;
            }
        }, 300);

    }


  getOrdersByCustomer(id :number){

    this.orderService.getOrderByCustomer(id).subscribe(data=>{

      this.allOrdersByCustomerList = data;

    })
  }

    goToEditPage(index,id) {

        let pageTmp = ((index-1) / 20)+1;
        localStorage.setItem('lastPaginationPageNumberOnCustomerViewPage', pageTmp.toString());
        let textTmp = this.findInputTextOnCustomerViewPage;
        localStorage.setItem('findInputTextOnCustomerViewPage', textTmp);
        this.router.navigate(["/customer/",id]);
    }

  showDeleteConfirmWindow(customerId : number) {

    this.confirmationService.confirm({

      message: 'Jesteś pewny że chcesz usunąć tego klienta ?',

      accept: () => {
        this.customerService.deleteCustomer(customerId).subscribe(

            data => {

              console.log("odpowipedz" +data);
              this.messageServiceExt.addMessage('success', 'Status', 'Usunięto klienta');
              this.refreshData();
            },
            error => {

              this.messageServiceExt.addMessage('error', 'Błąd', error.text());

            });

      },
      reject: () => {

      }
    });


  }
  }
