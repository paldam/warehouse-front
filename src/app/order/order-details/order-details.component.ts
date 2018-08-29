import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../order.service";
import {Order} from "../../model/order.model";
import {OrderItem} from "../../model/order_item";
import {DeliveryType} from "../../model/delivery_type.model";
import {Customer} from "../../model/customer.model";
import {OrderStatus} from "../../model/OrderStatus";
import {Product} from "../../model/product.model";
import {ConfirmationService, FileUpload} from "primeng/primeng";
import {AuthenticationService} from "../../authentication.service";
import {Basket} from "../../model/basket.model";
import {BasketService} from "../../basket/basket.service";
import {File} from "../../model/file";
import {FileSendService} from "../../file-send/file-send.service";
import {TOKEN, TOKEN_USER} from '../../authentication.service';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {

  public order : Order = new Order();
  public orderItems : OrderItem[]=[];
  public deliveryTypes: DeliveryType[]=[];
  public customer : Customer = new Customer() ;
  public isReadOnlyProp: boolean = true;
  public formSubmitted: boolean = false;
  public orderStatus: OrderStatus[]= [];
  public loading: boolean= false;
  public totalAmount: number;
  public orderStatusId: number;
  public baskets: Basket[]=[];
  public total: number = 0;
  public fileList: File[]=[];
  public orderId :number;
    public items: MenuItem[];
    public selectedBasketOnContextMenu: Basket = new Basket();
    public confirmDialogShow: boolean = false;
  @ViewChild(FileUpload) fileUploadElement: FileUpload;


  constructor(private confirmationService: ConfirmationService,private fileSendService: FileSendService,private basketService : BasketService,private orderService : OrderService,activeRoute: ActivatedRoute, private  router: Router,public authenticationService: AuthenticationService) {

      this.orderId= activeRoute.snapshot.params["id"];

     orderService.getOrder(this.orderId).subscribe(res =>{
                  this.order = res;
                  this.customer =  res.customer;
                  this.orderItems = res.orderItems;
                  this.totalAmount = res.orderTotalAmount/100;
                  this.order.cod /=100;
                  this.recalculate();
                  this.fileUploadElement.url = "http://145.239.92.96:8080/uploadfiles?orderId="+this.orderId;

         })
      this.orderService.getDeliveryTypes().subscribe(data=> this.deliveryTypes = data);
      this.orderService.getOrderStatus().subscribe(data=> this.orderStatus=data);
      this.orderService.getFileList(this.orderId).subscribe(data=>{
          this.fileList= data;
      });
      this.basketService.getBaskets().subscribe(data=> this.baskets = data);



  }


  ngOnInit() {
      this.items = [
          {label: 'Dodaj kosz', icon: 'fa fa-plus',command: (event) => this.addBasketToOrder(this.selectedBasketOnContextMenu)},
      ];
  }

    contextMenuSelected(event){
        this.selectedBasketOnContextMenu = event.data;
    }

  compareDeliveryType( optionOne : DeliveryType, optionTwo : DeliveryType) : boolean {
    return optionTwo && optionTwo ? optionOne.deliveryTypeId === optionTwo.deliveryTypeId :optionOne === optionTwo;
}
    compareOrderStatus( optionOne : OrderStatus, optionTwo : OrderStatus) : boolean {
        console.log(optionOne + '' + optionTwo);
        return optionTwo && optionTwo ? optionOne.orderStatusId === optionTwo.orderStatusId :optionOne === optionTwo;

    }
  isFormReadOnly() : boolean{
    return this.isReadOnlyProp;
  }


  editOrderForm() {
      if (this.order.deliveryType.deliveryTypeId == 5 || this.order.deliveryType.deliveryTypeId == 6 ||this.order.deliveryType.deliveryTypeId == 7 ){
          this.order.cod *=100;
      }else{
          this.order.cod =0;
      }

      this.order.customer = this.customer;
      this.order.orderTotalAmount = this.total;

      this.orderService.saveOrder(this.order).subscribe(data=>{

          this.fileUploadElement.url = "http://145.239.92.96:8080/uploadfiles?orderId="+ this.orderId;  // PrimeNg fileUpload component
          this.fileUploadElement.upload();
          this.router.navigateByUrl('/orders');

    },error2 => {
      console.log("error");
    })
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
    cancelEdit(){
        this.router.navigateByUrl('/orders');
    }

    deleteProductLine(id : number){

        let index = this.orderItems.findIndex(data=> data.basket.basketId == id);
        if (index > -1){
            this.orderItems.splice(index,1);
        }
        this.recalculate();
        // this.recalculateTotalPlusMarkUp();
    }

    recalculate(){
        this.total = 0;
        this.orderItems.forEach(orderItem=> {
            this.total += (orderItem.basket.basketTotalPrice * orderItem.quantity);
        })

    }


    getFile(id: number){
        this.fileSendService.getFile(id).subscribe(res=>{
            let a = document.createElement("a")
            console.log("sdsdssdd");
            let blobURL = URL.createObjectURL(res)
            a.download = this.fileSendService.fileName;
            a.href = blobURL
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        });
    }

    deleteFile(id: number){
        this.fileSendService.deleteFile(id).subscribe(res=>{
            this.refreshFileList();
        })

    }

    refreshFileList(){
        setTimeout(() => {
            this.orderService.getFileList(this.orderId).subscribe(data=>{this.fileList= data;});
        }, 1000);

    }


    onBeforeUpload(event){
        let token = localStorage.getItem(TOKEN);
        event.xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    }


    ShowConfirmModal(file: File) {
        this.confirmationService.confirm({
            message: 'Jesteś pewny że chcesz usunąć ten plik ?',
            accept: () => {

                this.fileSendService.deleteFile(file.fileId).subscribe(res=>{
                    this.refreshFileList();
                })

            },
            reject:()=>{

            }
        });
    }
}
