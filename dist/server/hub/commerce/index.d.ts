import { Operation } from '@/server/operation';
export declare class CommerceBackend {
    config: any;
    productOperation: Operation;
    categoryOperation: Operation;
    constructor(config: any);
    getCategory(args: any): Promise<any>;
    postCategory(args: any): Promise<any>;
    getProduct(args: any): Promise<any>;
    getProducts(args: any): Promise<any>;
    postProduct(args: any): Promise<any>;
    deleteProduct(args: any): Promise<any>;
    getImagesForVariant(parent: any): Promise<any>;
    getSource(): string;
}
