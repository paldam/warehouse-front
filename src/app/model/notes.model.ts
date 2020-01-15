export class Notes {
	constructor(
		public notesId?: number,
		public creationDate?: Date,
		public expirationDate?: Date,
		public priority?: number,
		public noteContent?: string,
		public noteStatus?: number,
		public addedBy?: string,
	) {
	}
}