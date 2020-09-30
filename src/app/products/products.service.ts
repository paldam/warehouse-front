import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Product} from '../model/product.model';
import {Response, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map';
import {ProductType} from '../model/product_type.model';
import {HttpService} from "../http-service";
import {Supplier} from "../model/supplier.model";
import {ProductSubType} from "../model/product_sub_type";
import {Basket} from "../model/basket.model";
import {ProductSeason} from "../model/product_season.model";

@Injectable()
export class ProductsService {
	public protocol: string = "http";
	public port: number = 8080;
	public baseUrl: string;

	constructor(private http: HttpService) {
		this.baseUrl = `${this.protocol}://${location.hostname}:${this.port}`;
	}

	getProducts(): Observable<Product[]> {
		return this.http.get(this.baseUrl + `/products`)
			.map((response: Response) =>
				response.json());
	}

	getProductsBySupplier(id: number): Observable<Product[]> {
		return this.http.get(this.baseUrl + `/productsbysupplier/${id}`)
			.map((response: Response) =>
				response.json());
	}

	getSuppliers(): Observable<Supplier[]> {
		return this.http.get(this.baseUrl + `/products/supplier`)
			.map((response: Response) =>
				response.json());
	}

	saveSupplier(supplier: Supplier): Observable<Response> {
		return this.http.post(this.baseUrl + `/products/supplier/`, supplier)
	}

	deleteSupplier(id: number): Observable<Response> {
		return this.http.delete(this.baseUrl + `/products/supplier/${id}`)
	}

	setMultiDelivery(ids: number[], values: number[]): Observable<Response> {
		return this.http.get(this.baseUrl + `/products/multidelivery/${ids}/${values}`)
			.map((response: Response) => response.json());
	}

	deleteProductType(id: number): Observable<Response> {
		return this.http.delete(this.baseUrl + `/products/types/${id}`)
	}

	deleteSubProductType(id: number): Observable<Response> {
		return this.http.delete(this.baseUrl + `/products/subtypes/${id}`)
	}

	changeStockEndResetOfProductsToDelivery(id: number, value: number): Observable<Response> {
		return this.http.post(this.baseUrl + `/product/stock/`, null, {
			params: {
				productId: id,
				addValue: value
			}
		})
	}

	addNumberOfProductsDelivery(id: number, value: number): Observable<Response> {
		return this.http.post(this.baseUrl + `/product/order/`, null, {
			params: {
				productId: id,
				addValue: value
			}
		})
	}

	getProductsToOrder(startDate, endDate): Observable<any[]> {
		return this.http.get(this.baseUrl + `/orders/products_to_order/daterange?startDate=${startDate}&endDate=${endDate}`)
			.map((response: Response) =>
				response.json());
	}

	getProductsToOrderWithoutDeletedByDeliveryDate(startDate, endDate): Observable<any[]> {
		console.log("11");
		return this.http.get(this.baseUrl
			+ `/orders/products_to_order_without_deleted_by_delivery_date/daterange?startDate=${startDate}&endDate=${endDate}`)
			.map((response: Response) =>
				response.json());
	}

	getProductsToOrderWithoutDeletedByOrderDate(startDate, endDate): Observable<any[]> {
		console.log("2");
		return this.http.get(
			this.baseUrl + `/orders/products_to_order_without_deleted_by_order_date/daterange?startDate=${startDate}&endDate=${endDate}`)
			.map((response: Response) =>
				response.json());
	}

	getProduct(id: number): Observable<Product> {
		return this.http.get(this.baseUrl + `/products/${id}`)
			.map((response: Response) =>
				response.json());
	}

	getBasketsContainSpecyficProduct(id: number) {
		return this.http.get(this.baseUrl + `/baskets_by_product/${id}`)
			.map((response: Response) =>
				response.json());
	}

	getProductsTypes(): Observable<ProductType[]> {
		return this.http.get(this.baseUrl + `/products/types`)
			.map((response: Response) =>
				response.json());
	}

	getInactiveProductsTypes(): Observable<ProductType[]> {
		return this.http.get(this.baseUrl + `/products/types/inactive`)
			.map((response: Response) =>
				response.json());
	}

	setTypeInactive(id: number): Observable<ProductType[]> {
		return this.http.get(this.baseUrl + `/products/types/inactive/${id}`)
			.map((response: Response) =>
				response.json());
	}

	setTypeActive(id: number): Observable<ProductType[]> {
		return this.http.get(this.baseUrl + `/products/types/active/${id}`)
			.map((response: Response) =>
				response.json());
	}


	getProductsSubTypes(): Observable<any[]> {
		return this.http.get(this.baseUrl + `/products/sub_types`)
			.map((response: Response) =>
				response.json());
	}

	getProductSeasons(): Observable<any[]> {
		return this.http.get(this.baseUrl + `/products/seasons`)
			.map((response: Response) =>
				response.json());
	}

	saveProduct(product: Product): Observable<Response> {
		return this.http.post(this.baseUrl + `/products/`, product)
		//.map((response: Response) => response.json());
	}

	saveProductWithImg(product: Product, fileToUpload: File): Observable<Response> {
		const formData: FormData = new FormData();
		formData.append('productimage', fileToUpload, fileToUpload.name);
		const blobOverrides = new Blob([JSON.stringify(product)], {
			type: 'application/json',
		});
		formData.append('productobject', blobOverrides);
		return this.http.post(this.baseUrl + `/productwithimg/`, formData)
			.map((response: Response) => response.json());
	}


	saveBasketWithoutImg(product: Product): Observable<Response> {
		return this.http.post(this.baseUrl + `/productwithoutimage/`, product)
			.map((response: Response) => response.json());
	}


	saveProductType(productType: ProductType): Observable<Response> {
		return this.http.post(this.baseUrl + `/products/types`, productType)
		//.map((response: Response) => response.json());
	}

	saveProductSubType(productSubType: ProductSubType): Observable<Response> {
		return this.http.post(this.baseUrl + `/products/subtypes`, productSubType)
		//.map((response: Response) => response.json());
	}

	saveProductSeason(productSeason: ProductSeason): Observable<Response> {
		return this.http.post(this.baseUrl + `/products/seasons`, productSeason)
		//.map((response: Response) => response.json());
	}

	deleteProduct(id: number): Observable<Response> {
		return this.http.delete(this.baseUrl + `/products/${id}`)
	}

	getProductImg(productId: number): any {
		return this.http.get(this.baseUrl + `/productimage/${productId}`, {responseType: ResponseContentType.Blob})
			.map(res => {
				return new Blob([res.blob()], {type: 'image/jpeg'})
			})
	}
}
