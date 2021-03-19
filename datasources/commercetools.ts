const _ = require("lodash")
const CT = require("ctvault")

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

const getCTClient = async () => await CT.getClient('daves-test-project')

module.exports = {
    products: {
        get: async () => {
            let ct = await getCTClient()
            console.log(Object.keys(ct))
            let products = await ct.productProjections.all({ expand: ['categories[*]'] })
            return _.map(products, mapProduct(ct))
        },
        getById: async id => {
            let ct = await getCTClient()
            let product = _.first(await ct.productProjections.all({ expand: ['categories[*]'], where: [`id="${id}"`] }))
            return product && mapProduct(ct)(product)
        },
        getBySku: async sku => {
            let ct = await getCTClient()
            let product = _.first(await ct.productProjections.all({ expand: ['categories[*]'], where: [`masterVariant(sku="${sku}")`] }))
            return product && mapProduct(ct)(product)
        },
        getBySlug: async slug => {
            let ct = await getCTClient()
            let defaultLanguage = _.first(ct.projectMetadata.languages)
            let product = _.first(await ct.productProjections.all({ expand: ['categories[*]'], where: [`slug(${defaultLanguage}="${slug}")`] }))
            return product && mapProduct(ct)(product)
        }
    },

    categories: {
        get: async () => {
            let ct = await getCTClient()
            let categories = await ct.categories.all()
            // return _.map(categories, mapCategory(ct))
            return await Promise.all(categories.map(await populateCategory(ct)))
        },
        getById: async id => {
            let ct = await getCTClient()
            let category = _.first(await ct.categories.get({ where: [`id="${id}"`] }))
            return category && await populateCategory(ct)(category)
        },
        getBySlug: async slug => {
            let ct = await getCTClient()
            let defaultLanguage = _.first(ct.projectMetadata.languages)
            let category = _.first(await ct.categories.get({ where: [`slug(${defaultLanguage}="${slug}")`] }))
            return category && await populateCategory(ct)(category)
        }
    }
}