import _ = require("lodash")
const { products, categories } = require("../../mock-data/mock-data")

const MockBackend = context => {
  // product methods
  let getProducts = async () => _.map(products, mapProduct)
  let getProductById = async (id) => mapProduct(products.find(x => x.id === id))
  let getProductBySku = async (sku) => mapProduct(products.find(x => x.sku === sku))
  let getProductBySlug = async (slug) => mapProduct(products.find(x => x.slug === slug))
  let searchProducts = async (searchText) => ({ products: _.map(_.filter(products, prod => prod.name.toLowerCase().includes(searchText.toLowerCase())), mapProduct) })
  // end product methods

  // category methods
  let getCategories = async () => _.filter(categories, cat => !cat.parent)
  let getCategoryById = async (id) => categories.find(x => x.id === id)
  let getCategoryBySlug = async (slug) => categories.find(x => x.slug === slug)
  // end category methods

  // mappers
  let mapProduct = prod => {
    prod.categories = _.filter(categories, cat => _.includes(prod.categoryIds, cat.id))
    return prod
  }
  // end mappers

  return {
    getProducts,
    getProductById,
    getProductBySku,
    getProductBySlug,
    searchProducts,

    getCategories,
    getCategoryById,
    getCategoryBySlug
  }
}

module.exports = context => MockBackend(context)