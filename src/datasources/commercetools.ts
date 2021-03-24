const _ = require("lodash")
const CT = require("ctvault")

const getCTClient = async () => await CT.getClientFromConfig(global.config.commercetools)

const mapVariant = variant => ({
    id: variant.id,
    sku: variant.sku,
    prices: {
        list: variant.prices[0].value.centAmount / 100
    },
    images: _.map(variant.images, image => ({
        url: image.url
    })),
    defaultImage: { url: _.first(variant.images).url }
})

const mapCategory = ct => category => {
    let cat = category.obj || category
    let defaultLanguage = _.first(ct.projectMetadata.languages)
    return {
        id: category.id,
        name: cat.name[defaultLanguage],
        slug: cat.slug[defaultLanguage]
    }
}

const mapProduct: (ct: any) => (prod: any) => Product = (ct: any) => (prod: any) => {
    let defaultLanguage = _.first(ct.projectMetadata.languages)
    let allVariants = _.concat(prod.variants, [prod.masterVariant])
    return {
        id: `${prod.id}`,
        name: `${prod.name[defaultLanguage]}`,
        slug: `${prod.slug[defaultLanguage]}`,
        categories: _.map(prod.categories, mapCategory(ct)),
        variants: _.map(allVariants, mapVariant)
    }
}

const populateCategory: (ct: any) => (category: any) => Promise<Category> = ct => async category => {
    let cat = category.obj || category
    let defaultLanguage = _.first(ct.projectMetadata.languages)

    // get the child products
    let products = await ct.productProjectionsSearch.all({ expand: ['categories[*]'], filter: [`categories.id:"${category.id}"`] })

    // get the child categories
    let childCategories = await ct.categories.all({ where: [`parent(id="${category.id}")`] })

    return {
        id: category.id,
        name: cat.name[defaultLanguage],
        slug: cat.slug[defaultLanguage],
        products: _.map(products, mapProduct(ct)),
        children: _.map(childCategories, mapCategory(ct))
    }
}

let getProductProjections: (any) => Promise<Product[]> = async opts => {
    let ct = await getCTClient()
    return _.map(await ct.productProjections.all(opts), mapProduct(ct))
}

let searchProductProjections: (any) => Promise<Product[]> = async opts => {
    let ct = await getCTClient()
    return _.map(await ct.productProjectionsSearch.all(opts), mapProduct(ct))
}

let getCategories: (any) => Promise<Category[]> = async opts => {
    let ct = await getCTClient()
    return await Promise.all((await ct.categories.all(opts)).map(await populateCategory(ct)))
}

class CommerceToolsBackend implements CommerceBackend { 
    async getProducts() { 
        return await getProductProjections({ expand: ['categories[*]'] }) 
    }

    async getProductById(id) {
        return _.first(await getProductProjections({ expand: ['categories[*]'], where: [`id="${id}"`] }))
    }

    async getProductBySku(sku) {
        return _.first(await getProductProjections({ expand: ['categories[*]'], where: [`masterVariant(sku="${sku}")`] }))
    }

    async getProductBySlug(slug) {
        let ct = await getCTClient()
        let defaultLanguage = _.first(ct.projectMetadata.languages)
        let product = _.first(await ct.productProjections.all({ expand: ['categories[*]'], where: [`slug(${defaultLanguage}="${slug}")`] }))
        return product && mapProduct(ct)(product)
    }

    async searchProducts(searchText) {
        return { products: await searchProductProjections({ expand: ['categories[*]'], where: [`text.en="${searchText}"`] }) }
    }

    async getCategories() {
        return await getCategories({ where: [`ancestors is empty`] })
    }

    async getCategoryById(id) {
        return _.first(await getCategories({ where: [`id="${id}"`] }))
    }

    async getCategoryBySlug(slug) {
        let ct = await getCTClient()
        let defaultLanguage = _.first(ct.projectMetadata.languages)
        let category = _.first(await ct.categories.all({ where: [`slug(${defaultLanguage}="${slug}")`] }))
        return category && await populateCategory(ct)(category)
    }
}

module.exports = new CommerceToolsBackend()