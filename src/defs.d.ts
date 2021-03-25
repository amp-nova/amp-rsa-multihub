declare module NodeJS {
    interface Global {
        config: any
        logger: any
    }
}

interface CommerceBackend {
    getProducts(): Promise<Product[]>
    getProductById(id: string): Promise<Product>
    getProductBySku(sku: string): Promise<Product>
    searchProducts(searchText: string): Promise<SearchResult>

    getCategories(): Promise<Category[]>
    getCategoryById(id: string): Promise<Category>
}
