declare const _: any;
declare const URI: any;
declare const axios: any;
declare const currency: any;
declare const stringify: any;
declare const Operation: any;
declare const mapImage: (image: any) => {
    url: any;
};
declare class CommerceToolsOperation extends Operation {
    constructor(backend: any);
    getBaseURL(): string;
    getRequest(args: any): any;
    localize(text: any): any;
    authenticate(): Promise<any>;
    translateResponse(data: any, mapper?: (x: any) => any): Promise<{
        meta: {
            limit: any;
            count: any;
            offset: any;
            total: any;
        };
        results: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown];
    }>;
    getHeaders(): Promise<{
        authorization: any;
    }>;
}
declare class CommerceToolsCategoryOperation extends CommerceToolsOperation {
    constructor(config: any);
    export(args: any): (category: any) => any;
    getRequestPath(args: any): string;
    get(args: any): Promise<any>;
}
declare class CommerceToolsCartDiscountOperation extends CommerceToolsOperation {
    constructor(config: any);
    getRequestPath(args: any): string;
}
declare class CommerceToolsProductOperation extends CommerceToolsOperation {
    constructor(config: any);
    getRequestPath(args: any): "product-projections/search" | "product-projections";
    get(args: any): Promise<any>;
    post(args: any): Promise<any>;
    export(args: any): (product: any) => any;
    postProcessor(args: any): Promise<(products: any) => Promise<any>>;
}
