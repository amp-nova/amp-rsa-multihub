const _ = require("lodash")
const CT = require("ctvault")
let config = require('../util/config')

const getCTClient = () => CT.getClientFromConfig({
    oauth_url       : config.commercetools.authUrl,
    api_url         : config.commercetools.apiUrl,
    project         : config.commercetools.projectKey,
    client_id       : config.commercetools.clientId,
    client_secret   : config.commercetools.clientSecret,
    scope           : config.commercetools.defaultScopes.join(' ')
})

const CommerceToolsBackend = async context => {
    let getLocalizedText = text => text[context.graphqlLocale] || text['en'] || _.first(text)

    let ct = getCTClient()
    if (context.commercetoolsProject) {
        ct = await CT.getClient(context.commercetoolsProject)
    }

    // product methods
    let getProducts = async () => await getProductProjections({ expand: ['categories[*]'] }) 
    let getProductById = async (id) => _.first(await getProductProjections({ expand: ['categories[*]'], where: [`id="${id}"`] }))
    let getProductBySku = async (sku) => _.first(await getProductProjections({ expand: ['categories[*]'], where: [`masterVariant(sku="${sku}")`] }))
    let getProductBySlug = async (slug) => {
        let product = _.first(await getProductProjections({ expand: ['categories[*]'], where: [`slug(${context.graphqlLocale}="${slug}")`] }))
        return product && mapProduct(product)
    }
    let searchProducts = async (searchText) => ({ products: await searchProductProjections({ expand: ['categories[*]'], where: [`text.en="${searchText}"`] }) })
    // end product methods

    // category methods
    let getCategories = async () => await getCategoriesByOptions({ where: [`ancestors is empty`] })
    let getCategoryById = async (id) => _.first(await getCategoriesByOptions({ where: [`id="${id}"`] }))
    let getCategoryBySlug = async (slug) => {
        let category = _.first(await ct.categories.get({ where: [`slug(${context.graphqlLocale}="${slug}")`] }))
        return category && await populateCategory(category)
    }
    // end category methods

    let getProductProjections = async (opts) => _.map(await ct.productProjections.get(opts), mapProduct)
    let searchProductProjections = async (opts) => _.map(await ct.productProjectionsSearch.get(opts), mapProduct)
    let getCategoriesByOptions = async (opts) => await Promise.all((await ct.categories.get(opts)).map(await populateCategory))

    // mappers
    let mapProduct = product => ({
        id: `${product.id}`,
        name: `${getLocalizedText(product.name)}`,
        slug: `${getLocalizedText(product.slug)}`,
        categories: _.map(product.categories, mapCategory),
        variants: _.map(_.concat(product.variants, [product.masterVariant]), mapVariant)
    })

    let mapVariant = variant => ({
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
    
    let mapCategory = category => {
        let cat = category.obj || category
        return {
            id: category.id,
            name: getLocalizedText(cat.name),
            slug: getLocalizedText(cat.slug)
        }
    }
    // end mappers

    let populateCategory = async (category) => {
        let cat = category.obj || category
    
        // get the child products
        let products = await ct.productProjectionsSearch.get({ expand: ['categories[*]'], filter: [`categories.id:"${category.id}"`] })
    
        // get the child categories
        let childCategories = await ct.categories.get({ where: [`parent(id="${category.id}")`] })
    
        return {
            id: category.id,
            name: getLocalizedText(cat.name),
            slug: getLocalizedText(cat.slug),
            products: _.map(products, mapProduct),
            children: _.map(childCategories, mapCategory)
        }
    }

    return {
        getProducts,
        getProductById,
        getProductBySku,
        getProductBySlug,
        searchProducts,

        getCategories,
        getCategoryById,
        getCategoryBySlug
    } as CommerceBackend
}

module.exports = context => CommerceToolsBackend(context)