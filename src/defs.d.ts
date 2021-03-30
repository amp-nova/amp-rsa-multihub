declare module NodeJS {
    interface Global {
        config: any
        logger: any
    }
}

// interface CommerceBackend {
//     getProducts(query: any): Promise<any>
//     getProductById(query: any): Promise<Product>
//     getProductBySku(query: any): Promise<Product>
//     searchProducts(query: any): Promise<SearchResult>

//     getCategories(query: any): Promise<Category[]>
//     getCategoryById(query: any): Promise<Category>
// }
