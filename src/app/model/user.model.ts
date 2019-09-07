import {Authorities} from "./authorities.model";
export class User {
    constructor(
        public id?: number,
        public login?: string,
        public password?: string,
        public activated?: boolean,
        public authorities?: any[],
		public points?: number,

    ){
    }
}