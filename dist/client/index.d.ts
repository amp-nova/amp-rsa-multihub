import { Product, Category, PbxClient, PbxQueryContext } from '../index';
export declare const defaultPbxQueryContext: PbxQueryContext;
export declare class PbxGraphqlClient extends PbxClient {
    getGraphqlClient: (context: PbxQueryContext) => {
        query: (query: any) => Promise<import("@apollo/client/core").ApolloQueryResult<any>>;
    };
    getProducts(context: PbxQueryContext): Promise<Product[]>;
    getProduct(context: PbxQueryContext): Promise<Product>;
    getCategories(context: PbxQueryContext): Promise<Category[]>;
    getCategory(context: PbxQueryContext): Promise<Category>;
}
export declare const getClient: (url: string, backendKey: string) => PbxGraphqlClient;
