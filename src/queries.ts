const { gql } = require('@apollo/client/core');

const commonFields = `
    id
    name
    slug
`

const meta = `
    meta {
        total
        limit
        count
        offset
    }
`

const productFields = `
    ${commonFields}
    longDescription
    categories {
        ${commonFields}
    }
    variants {
        sku
        articleNumberMax: attribute(name: "articleNumberMax")
        prices {
            list
            sale
        }
        images {
            url
            large
            thumb
        }
    }
`

export const categoryHierarchyQuery = gql`    
    query categoryHierarchyQuery {
        categoryHierarchy {
            ${commonFields}
            children {
                ${commonFields}
                children {
                    ${commonFields}
                }
            }
        }
    }
`

export const productsQuery = gql`
    query productsQuery($keyword: String, $productIds: String) {
        products(keyword: $keyword, productIds: $productIds) {
            results {
                ${productFields}
            }
        }
    }
`

export const productQuery = gql`
    query productQuery($id: String, $slug: String, $sku: String) {
        product(id: $id, slug: $slug, sku: $sku) {
            ${productFields}
        }
    }
`

export const categoryQuery = gql`
    query categoryQuery($id: String, $slug: String) {
        category(id: $id, slug: $slug) {
            ${commonFields}
            products {
                ${productFields}
            }
        }
    }
`