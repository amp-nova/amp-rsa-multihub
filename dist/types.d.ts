import { Product, Category } from 'amp-rsa-types';
export declare type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
};
export declare class CommonArgs {
}
export declare class ListArgs extends CommonArgs {
    limit?: number;
    offset?: number;
}
export declare class Context {
    backendKey: string;
    commercehub: any;
}
export declare class GetCategoryArgs extends CommonArgs {
    id?: string;
    slug?: string;
}
export declare class GetCategoryProductArgs extends CommonArgs {
    full?: boolean;
    segment?: string;
}
export declare class GetProductsArgs extends ListArgs {
    keyword?: string;
    segment?: string;
    productIds?: string;
}
export declare class GetProductArgs extends CommonArgs {
    id?: string;
    sku?: string;
    slug?: string;
    segment?: string;
}
export declare class GetAttributeArgs {
    name: string;
}
export declare class QueryContext {
    args: CommonArgs;
    locale: string;
    language: string;
    country: string;
    currency: string;
    segment: string;
    appUrl: string;
    constructor(args?: CommonArgs, locale?: string, language?: string, country?: string, currency?: string, segment?: string, appUrl?: string);
}
export declare class CommerceClient {
    getProducts(context: QueryContext): Promise<Product[]>;
    getProduct(context: QueryContext): Promise<Product>;
    getCategories(context: QueryContext): Promise<Category[]>;
    getCategory(context: QueryContext): Promise<Category>;
}
declare const _default: {
    QueryContext: typeof QueryContext;
};
export default _default;
