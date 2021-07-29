const _ = require('lodash')

String.prototype.stripHTML = function() {
    return this.replace(/(<([^>]+)>)/gi, "")
}

Array.ensureArray = function(data) {
    return Array.isArray(data) ? data : [data]
}

const findCategory = (categories, args) => {
    let mapped = {}

    let flattenCategories = cats => {
        _.each(cats, cat => {
            mapped[cat.id] = cat
            flattenCategories(cat.children)
        })
    }

    flattenCategories(categories)

    if (args.id) {
        return mapped[args.id]
    }
    else {
        return _.find(_.values(mapped), cat => cat.slug === args.slug)
    }
}

module.exports = { findCategory }