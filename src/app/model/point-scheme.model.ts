import {BasketSeason} from "./basket_season.model";

export class PointScheme{
	constructor(
		public id?: number,
		public basketSezon?: BasketSeason,
		public points?: number,
		public step?: number,

	){

	}
}
