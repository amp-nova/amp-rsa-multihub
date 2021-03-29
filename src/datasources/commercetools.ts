const _ = require("lodash")

const CommerceToolsBackend = context => {
    let getLocalizedText = text => text[context.graphqlLocale] || text['en'] || _.first(text)
    let ct = context.backendClient

    // product methods
    let getProducts         = async args => await getProductProjections({ expand: ['categories[*]'] }, args) 
    let getProductById      = async args => await getProductProjection({ expand: ['categories[*]'], where: [`id="${args.id}"`] })
    let getProductBySku     = async args => await getProductProjection({ expand: ['categories[*]'], where: [`masterVariant(sku="${args.sku}")`] })
    let getProductBySlug    = async args => await getProductProjection({ expand: ['categories[*]'], where: [`slug(${context.graphqlLocale}="${args.slug}")`] })
    let searchProducts      = async args => ({ products: await searchProductProjections({ expand: ['categories[*]'], where: [`text.en="${args.searchText}"`] }, args) })
    // end product methods

    // category methods
    let getCategories       = async args => await getCategoriesByOptions({ where: [`ancestors is empty`] }, { ...args, mapper: populateCategory })
    let getCategoryById     = async args => await getCategoryByOptions({ where: [`id="${args.id}"`] }, { mapper: populateCategory })
    let getCategoryBySlug   = async args => await getCategoryByOptions({ where: [`slug(${context.graphqlLocale}="${args.slug}")`] }, { mapper: populateCategory })
    // end category methods

    let getProductProjection = async (opts, query = {}) => _.first((await getProductProjections(opts, query)).results)
    let getProductProjections = async (opts, query = {}) => {
        let { body } = await ct.productProjections.get(opts, query)
        return {
            ...body,
            results: _.map(body.results, mapProduct)
        }
    }
    let searchProductProjections = async (opts, query = {}) => {
        let { body } = await ct.productProjectionsSearch.get(opts, query)
        return {
            ...body,
            results: _.map(body.results, mapProduct)
        }
    }

    let getCategoryByOptions = async (opts, query = {}) => _.first((await getCategoriesByOptions(opts, query)).results)
    let getCategoriesByOptions = async (opts, args) => {
        let { body } = await ct.categories.get(opts)
        let results = await Promise.all(body.results.map(await args.mapper))
        return {
            ...body,
            results
        }
    }

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
            list: _.get(_.first(variant.prices), 'value.centAmount') / 100
        },
        images: _.map(variant.images, image => ({
            url: image.url
        })),
        defaultImage: { url: _.get(_.first(variant.images), 'url') }
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
        let cat = mapCategory(category)

        // get the child products
        let products = (await getProductProjections({ where: [`categories(id="${category.id}")`], expand: ['categories[*]'] })).results
    
        // get the child categories
        let children = (await getCategoriesByOptions({ where: [`parent(id="${category.id}")`] }, { mapper: mapCategory })).results
    
        return {
            ...cat,
            products,
            children
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