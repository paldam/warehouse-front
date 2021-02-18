import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";

export class CacheRouteReuseStrategy implements RouteReuseStrategy{

	storedRouteHandles = new Map<string, DetachedRouteHandle>();

	allowRetriveCache = {
		'orders/all': true ,
		'product' : true
	};


	shouldReuseRoute(before: ActivatedRouteSnapshot, curr:  ActivatedRouteSnapshot): boolean {
		if (this.getPath(before) === 'order/detail/:id' && this.getPath(curr) === 'orders/all') {
			this.allowRetriveCache['orders/all'] = true;
		} else {
			this.allowRetriveCache['orders/all'] = false;
		}

		if (this.getPath(before) === 'product/detail/:id' && this.getPath(curr) === 'product') {
			this.allowRetriveCache['product'] = true;
		} else {
			this.allowRetriveCache['product'] = false;
		}


		return before.routeConfig === curr.routeConfig;
	}
	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
	}
	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		const path = this.getPath(route);
		if (this.allowRetriveCache[path]) {
			return this.storedRouteHandles.has(this.getPath(route));
		}

		return false;
	}
	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		const path = this.getPath(route);
		if (this.allowRetriveCache.hasOwnProperty(path)) {
			return true;
		}
		return false;
	}
	store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
		this.storedRouteHandles.set(this.getPath(route), detachedTree);
	}


	private getPath(route: ActivatedRouteSnapshot): string {
		if (route.routeConfig !== null && route.routeConfig.path !== null) {
			return route.routeConfig.path;
		}
		return '';
	}
}