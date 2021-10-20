import { Product, Category } from '@amp-nova/amp-rsa-types';
import { QueryContext, CommerceClient } from '../src/types';
export declare class PbxCommerceClient implements CommerceClient {
    url: string;
    key: string;
    constructor({ url, key }: {
        url: any;
        key: any;
    });
    getGraphqlClient: (context: QueryContext) => {
        query: (query: any) => Promise<import("@apollo/client/core").ApolloQueryResult<any>>;
    };
    getProduct: (context: QueryContext) => Promise<Product>;
    getProducts: (context: QueryContext) => Promise<Product[]>;
    getCategories: (context: QueryContext) => Promise<Category[]>;
    getCategory: (context: QueryContext) => Promise<Category>;
}
export default PbxCommerceClient;
