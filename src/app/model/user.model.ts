export class User {
	constructor(
		public id?: number,
		public login?: string,
		public name?: string,
		public email?: string,
		public password?: string,
		public activated?: boolean,
		public authorities?: any[],
		public points?: number,
	) {
	}
}