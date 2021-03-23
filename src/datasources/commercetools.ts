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

    console.log(JSON.stringify({
        id: category.id,
        name: cat.name[defaultLanguage],
        slug: cat.slug[defaultLanguage]
    }))

    return {
        id: category.id,
        name: cat.name[defaultLanguage],
        slug: cat.slug[defaultLanguage]
    }
}

const mapProduct = ct => prod => {
    let defaultLanguage = _.first(ct.projectMetadata.languages)
    let allVariants = _.concat(prod.variants, [prod.masterVariant])
    return {
        id: prod.id,
        name: prod.name[defaultLanguage],
        slug: prod.slug[defaultLanguage],
        categories: _.map(prod.categories, mapCategory(ct)),
        variants: _.map(allVariants, mapVariant)
    }
}

const populateCategory = ct => async category => {
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

let getProductProjections = async opts => {
    let ct = await getCTClient()
    return _.map(await ct.productProjections.all(opts), mapProduct(ct))
}

let getCategories = async opts => {
    let ct = await getCTClient()
    return await Promise.all((await ct.categories.all(opts)).map(await populateCategory(ct)))
}

module.exports = {
    products: {
        get: async () => await getProductProjections({ expand: ['categories[*]'] }),
        getById: async id => _.first(await getProductProjections({ expand: ['categories[*]'], where: [`id="${id}"`] })),
        getBySku: async sku => _.first(await getProductProjections({ expand: ['categories[*]'], where: [`masterVariant(sku="${sku}")`] })),
        getBySlug: async slug => {
            let ct = await getCTClient()
            let defaultLanguage = _.first(ct.projectMetadata.languages)
            let product = _.first(await ct.productProjections.all({ expand: ['categories[*]'], where: [`slug(${defaultLanguage}="${slug}")`] }))
            return product && mapProduct(ct)(product)
        }
    },

    categories: {
        get: async () => await getCategories({}),
        getById: async id => _.first(await getCategories({ where: [`id="${id}"`] })),
        getBySlug: async slug => {
            let ct = await getCTClient()
            let defaultLanguage = _.first(ct.projectMetadata.languages)
            let category = _.first(await ct.categories.all({ where: [`slug(${defaultLanguage}="${slug}")`] }))
            return category && await populateCategory(ct)(category)
        }
    }
}