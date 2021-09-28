export declare class Prices {
    sale?: string;
    list?: string;
}
export declare class ProductImage {
    url: string;
    large?: string;
    thumb?: string;
}
export declare class ResultsMeta {
    limit: number;
    offset: number;
    count: number;
    total: number;
}
export declare class ProductResults {
    meta: ResultsMeta;
    results: [Product];
}
export declare class CategoryResults {
    meta: ResultsMeta;
    results: [Category];
}
export declare class Identifiable {
    id: string;
}
export declare class CommerceObject extends Identifiable {
    slug: string;
    name: string;
    raw: string;
}
export declare class Product extends CommerceObject {
    shortDescription?: string;
    longDescription?: string;
    categories: Category[];
    variants: Variant[];
    productType: string;
}
export declare class Attribute {
    name: string;
    value: string;
}
export declare class Variant extends Identifiable {
    sku: string;
    prices: Prices;
    defaultImage?: ProductImage;
    images: ProductImage[];
    attributes: Attribute[];
    color?: string;
    size?: string;
    articleNumberMax?: string;
}
export declare class Category extends CommerceObject {
    children: Category[];
    products: Product[];
}
export declare class SearchResult {
    products: Product[];
}
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
export declare class PbxQueryContext {
    args: CommonArgs;
    locale: string;
    language: string;
    country: string;
    currency: string;
    segment: string;
    appUrl: string;
    constructor(context: PbxQueryContext);
}
export declare class PbxClient {
    url: string;
    key: string;
    constructor(url: any, key: any);
    getProducts(context: PbxQueryContext): Promise<Product[]>;
    getProduct(context: PbxQueryContext): Promise<Product>;
    getCategories(context: PbxQueryContext): Promise<Category[]>;
    getCategory(context: PbxQueryContext): Promise<Category>;
}
declare const _default: {
    PbxClient: typeof PbxClient;
    PbxQueryContext: typeof PbxQueryContext;
};
export default _default;
