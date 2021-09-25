import { User } from "./user";

export class Deliverer extends User {
    deliveryName?: string;
    status?: boolean;
    siret?: string;
    sectors?: Array<any>;
}
