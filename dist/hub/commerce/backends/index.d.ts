declare const _: any;
declare const Operation: any;
declare const logger: any;
declare let defaultArgs: {
    currency: string;
    locale: string;
    language: string;
    country: string;
};
declare class CommerceBackend {
    config: any;
    productOperation: any;
    categoryOperation: any;
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
