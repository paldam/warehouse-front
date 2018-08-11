import {User} from "./user.model";
import {Order} from "./order.model";
export class OrderEditAudit{
    constructor(
        public orderEditAuditId?: number,
        public order?: Order,
        public user?: User,
        public changeDate?: Date,
    ){

    }
}
