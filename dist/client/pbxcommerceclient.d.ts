import { Product, Category, QueryContext, CommerceClient } from '../types';
export declare class PbxCommerceClient extends CommerceClient {
    url: string;
    key: string;
    constructor(url: string, key: string);
    getGraphqlClient: (context: QueryContext) => {
        query: (query: any) => Promise<import("@apollo/client/core").ApolloQueryResult<any>>;
    };
    getProduct: (context: QueryContext) => Promise<Product>;
    getProducts: (context: QueryContext) => Promise<Product[]>;
    getCategories: (context: QueryContext) => Promise<Category[]>;
    getCategory: (context: QueryContext) => Promise<Category>;
}
export default PbxCommerceClient;
