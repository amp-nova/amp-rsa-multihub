var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
// 3rd party libs
const _ = require('lodash');
const URI = require('urijs');
const axios = require('axios');
const currency = require('currency.js');
const stringify = require('json-stringify-safe');
const { Operation } = require('@/operations/operation');
const { formatMoneyString } = require('@/util/locale-formatter');
const mapImage = image => image && ({ url: image.url });
class CommerceToolsOperation extends Operation {
    constructor(backend) {
        super(backend);
        this.accessToken = null;
    }
    getBaseURL() {
        return `${this.backend.config.cred.api_url}/${this.backend.config.cred.project}`;
    }
    getRequest(args) {
        let uri = new URI(this.getURL(args));
        let query = {
            limit: args.limit,
            offset: args.offset,
            where: args.where,
            filter: args.filter,
            ...args,
        };
        // add any filters based on the args
        uri.addQuery(query);
        return uri.toString();
    }
    localize(text, args) {
        if (text.label) {
            text = text.label;
        }
        if (typeof text === 'string') {
            return text;
        }
        return text[args.language] || text['en'] || text[Object.keys(text)[0]];
    }
    async authenticate() {
        if (!this.accessToken) {
            let response = await axios.post(`${this.backend.config.cred.oauth_url}/oauth/token?grant_type=client_credentials&scope=${_.first(_.split(this.backend.config.cred.scope, ' '))}`, {}, {
                auth: {
                    username: this.backend.config.cred.client_id,
                    password: this.backend.config.cred.client_secret
                }
            });
            this.accessToken = `${response.data.token_type} ${response.data.access_token}`;
        }
        return this.accessToken;
    }
    async translateResponse(data, mapper = (x => x)) {
        // a commercetools response will be either a single object, or an array in 'results'
        // if it is an array, limit, count, total, and offset are provided on the object
        return {
            meta: data.limit && {
                limit: data.limit,
                count: data.count,
                offset: data.offset,
                total: data.total
            },
            results: await Promise.all((data.results || data).map(await mapper))
        };
    }
    async getHeaders() {
        return { authorization: await this.authenticate() };
    }
}
// category operation
class CommerceToolsCategoryOperation extends CommerceToolsOperation {
    constructor(config) {
        super(config);
    }
    export(args) {
        let self = this;
        return function (category) {
            return {
                ...category,
                name: self.localize(category.name, args),
                slug: self.localize(category.slug, args)
            };
        };
    }
    getRequestPath(args) {
        return `categories`;
    }
    async get(args) {
        return await super.get({
            ...args,
            limit: 500,
            where: args.slug && [`slug(${args.language || 'en'}="${args.slug}") or slug(en="${args.slug}")`] ||
                args.id && [`id="${args.id}"`]
        });
    }
}
// end category operations
// cart discount operation
class CommerceToolsCartDiscountOperation extends CommerceToolsOperation {
    constructor(config) {
        super(config);
    }
    getRequestPath(args) {
        return `cart-discounts`;
    }
}
// end cart discount operations
// product operation
class CommerceToolsProductOperation extends CommerceToolsOperation {
    constructor(config) {
        super(config);
    }
    getRequestPath(args) {
        return (args.keyword || args.filter) ? `product-projections/search` : `product-projections`;
    }
    async get(args) {
        return await super.get({
            ...args,
            expand: ['categories[*]'],
            priceCountry: args.country,
            priceCurrency: args.currency,
            [`text.${args.language}`]: args.keyword,
            filter: args.productIds && [`id:${_.map(args.productIds.split(','), x => `"${x}"`).join(',')}`],
            where: args.id && [`id="${args.id}"`] ||
                args.slug && [`slug(${args.language}="${args.slug}") or slug(en="${args.slug}")`] ||
                args.sku && [`variants(sku="${args.sku}")`]
        });
    }
    async post(args) {
        args = {
            ...args,
            body: Promise.resolve().then(() => __importStar(require(args.product)))
        };
        return await super.post(args);
    }
    export(args) {
        let self = this;
        return function (product) {
            return {
                ...product,
                name: this.localize(product.name, args),
                slug: this.localize(product.slug, args),
                longDescription: product.metaDescription && this.localize(product.metaDescription, args),
                variants: _.map(_.concat(product.variants, [product.masterVariant]), variant => {
                    return {
                        ...variant,
                        sku: variant.sku || product.key,
                        prices: {
                            list: formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100, args.locale, args.currency),
                            sale: formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100, args.locale, args.currency)
                        },
                        images: _.map(variant.images, mapImage),
                        attributes: _.map(variant.attributes, att => ({ name: att.name, value: self.localize(att.value, args) }))
                    };
                }),
                categories: _.map(product.categories, function (cat) {
                    let category = cat.obj || cat;
                    return {
                        ...category,
                        name: this.localize(category.name, args),
                        slug: this.localize(category.slug, args)
                    };
                }),
                productType: product.productType.id
            };
        };
    }
    async postProcessor(args) {
        let self = this;
        return async function (products) {
            if (self.backend.config.context.userContext.segment) {
                let discountOperation = new CommerceToolsCartDiscountOperation(self.backend);
                let cartDiscounts = (await discountOperation.get({})).getResults();
                let applicableDiscounts = _.filter(cartDiscounts, cd => args.segment && cd.cartPredicate === `customer.customerGroup.key = "${args.segment.toUpperCase()}"`);
                return _.map(products, product => {
                    return {
                        ...product,
                        variants: _.map(product.variants, variant => {
                            let sale = currency(variant.prices.list).value;
                            _.each(applicableDiscounts, discount => {
                                if (discount.target.type === 'lineItems') {
                                    let [predicateKey, predicateValue] = discount.target.predicate.split(" = ");
                                    if (discount.target.predicate === '1 = 1' || (predicateKey === 'productType.id' && `"${product.productType}"` === predicateValue)) {
                                        if (discount.value.type === 'relative') {
                                            // permyriad is pct off * 10000
                                            sale = sale * (1 - discount.value.permyriad / 10000);
                                        }
                                    }
                                }
                            });
                            variant.prices.sale = currency(sale).format();
                            return variant;
                        })
                    };
                });
            }
            else {
                return products;
            }
        };
    }
}
module.exports = {
    productOperation: backend => new CommerceToolsProductOperation(backend),
    categoryOperation: backend => new CommerceToolsCategoryOperation(backend),
};
