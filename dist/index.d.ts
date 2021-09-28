import { Product, Category, PbxClient, PbxQueryContext } from './types';
export declare const defaultPbxQueryContext: PbxQueryContext;
export declare class PbxGraphqlClient extends PbxClient {
    getGraphqlClient: (context: PbxQueryContext) => {
        query: (query: any) => Promise<import("@apollo/client/core").ApolloQueryResult<any>>;
    };
    getProduct: (context: PbxQueryContext) => Promise<Product>;
    getProducts: (context: PbxQueryContext) => Promise<Product[]>;
    getCategories: (context: PbxQueryContext) => Promise<Category[]>;
    getCategory: (context: PbxQueryContext) => Promise<Category>;
}
export * from './types';
