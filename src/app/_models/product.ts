import {CategoryProduct} from "@app/_models/category-product";
import {ListSupplements} from "@app/_models/list-supplements";
import {Supplement} from "@app/_models/supplement";

export class Product {
    name: string = '';
    id: number = 0;
    amount: number = 0;
    quantity: number = 0;
    category: CategoryProduct = new CategoryProduct();
    business_id: number;
    // Quantity chosen by customer
    // tslint:disable-next-line:variable-name
    remaining_quantity: number = 0;
    createdAt: string;
    updatedAt: string;
    commentCustomer: string;
    addComment: boolean;
    supplementsProduct: any[];
    infoCommentCustomer: string;
    created_at: {date};
    updated_at: {date};
    description = '';
    photo?: string = '';
    urlPhoto?: string = '';
    url_photo?: string;
    additionalInformations?: string = '';
    isAvailable?: boolean = true;
    is_available?: boolean;
    hasListOrSupplement: boolean = false;
    listSupplements: ListSupplements[] = [];
    supplementProducts: Supplement[] = [];
    indexProduct?: number;
}

