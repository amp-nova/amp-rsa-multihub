import _ = require("lodash")
const { products, categories } = require("../../mock-data/mock-data")

let mapProduct = prod => {
  prod.categories = _.filter(categories, cat => _.includes(prod.categoryIds, cat.id))
  return prod
}

class MockBackend implements CommerceBackend { 
  async getProducts() { 
      return _.map(products, mapProduct)
  }

  async getProductById(id) {
      return mapProduct(products.find(x => x.id === id))
  }

  async getProductBySku(sku) {
      return mapProduct(products.find(x => x.sku === sku))
  }

  async getProductBySlug(slug) {
    return mapProduct(products.find(x => x.slug === slug))
  }

  async searchProducts(searchText) {
    let filtered = _.filter(products, prod => prod.name.toLowerCase().includes(searchText.toLowerCase()))
    return { products: _.map(filtered, mapProduct) }
  }

  async getCategories() {
      return _.filter(categories, cat => !cat.parent)
  }

  async getCategoryById(id) {
      return categories.find(x => x.id === id)
  }

  async getCategoryBySlug(slug) {
    return categories.find(x => x.slug === slug)  
  }
}

module.exports = new MockBackend()

// module.exports = {
//   products: {
//     get: () => _.map(products, mapProduct),
//     getById: id => mapProduct(products.find(x => x.id === id)),
//     getBySku: sku => mapProduct(products.find(x => x.sku === sku)),
//     getBySlug: slug => mapProduct(products.find(x => x.slug === slug)),
//     search: searchText => {
//       let filtered = _.filter(products, prod => prod.name.toLowerCase().includes(searchText.toLowerCase()))
//       return { products: _.map(filtered, mapProduct) }
//     },
//   },
//   categories: {
//     get: () => categories,
//     getById: id => categories.find(x => x.id === id),
//     getBySlug: slug => categories.find(x => x.slug === slug)
//   }
// }