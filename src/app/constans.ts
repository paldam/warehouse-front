export class AppConstans {
	static readonly PAGINATOR_VALUES = [20, 50, 100, 200, 500, 1000, 2000, 5000];
	static readonly ORDER_STATUS_W_TRAKCIE_REALIZACJI: number = 6;
	static readonly ORDER_STATUS_NOWE: number = 1;
	static readonly ORDER_STATUS_ZREALIZOWANE: number = 5;
	static readonly ORDER_STATUS_USUNIETE: number = 99;
	static readonly BASKET_TYPE_ID_OFERTOWY = 1;
	static readonly BASKET_TYPE_ID_TYMCZASOWY = 2;
	static readonly BASKET_TYPE_ID_EXPORTOWY = 100;
	static readonly BASKET_TYPE_ID_USUNIETY = 99;
	static readonly BASKET_TYPE_ID_ARCHWIUM = 999;
	static readonly BASKET_SEASON_ID_NONE= 0;
	static readonly DELIVERY_TYPE_PACZKA_KURIER_ID: number = 1;
	static readonly BASKET_GRAWER_ID: number = 206;
	static readonly BASKET_KARTKA_Z_LOGO_ID: number = 188;
	static readonly BASKET_KARTKA_BEZ_LOGO_ID: number = 187;
	static readonly GOOGLE_MAPS_API_KEY: string = 'AIzaSyBdxjMxuTAKacU8S50s8AuVosAW-VN2yO4'
}