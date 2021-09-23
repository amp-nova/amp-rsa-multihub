"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const URI = require('urijs');
const { formatMoneyString } = require('@/util/locale-formatter');
const { findCategory } = require('@/util/helpers');
const { Operation } = require('@/operations/operation');
const mapImage = image => ({ url: image.url_standard });
const slugify = require('slugify');
class BigCommerceOperation extends Operation {
    constructor(config) {
        super(config);
    }
    getBaseURL() {
        return `${this.backend.config.cred.apiUrl}/stores/${this.backend.config.cred.storeHash}/v3/catalog`;
    }
    getRequest(args) {
        let uri = new URI(this.getURL(args));
        if (args && args.limit && args.offset) {
            args.page = Math.floor(args.offset / args.limit + 1);
            // delete args.offset
        }
        let queryArgs = lodash_1.default.omit(args, [
            'locale',
            'offset',
            'language',
            'country',
            'currency',
            'category',
            'product',
            'body',
            'slug',
            'method',
            'productIds'
        ]);
        uri.addQuery(queryArgs);
        return uri.toString();
    }
    async translateResponse(response, mapper = x => x) {
        // a bc response will always have 'meta' and 'data'
        // 'data' will sometimes be just an object, sometimes an array
        response.data = Array.isArray(response.data) ? response.data : [response.data];
        return {
            meta: response.meta && response.meta.pagination && {
                total: response.meta.pagination.total,
                count: response.meta.pagination.count,
                limit: response.meta.pagination.per_page,
                offset: (response.meta.pagination.current_page - 1) * response.meta.pagination.per_page
            },
            results: await Promise.all(response.data.map(await mapper))
        };
    }
    async getHeaders() {
        return {
            'X-Auth-Token': this.backend.config.cred.apiToken,
            'Content-Type': `application/json`
        };
    }
}
// category operation
class BigCommerceCategoryOperation extends BigCommerceOperation {
    constructor(config) {
        super(config);
    }
    getRequestPath(args) {
        return `categories/tree`;
    }
    async post(args) {
        return await super.post({
            ...args,
            body: Promise.resolve().then(() => __importStar(require(args.category)))
        });
    }
    import(input) {
        return {
            name: input.name,
            parent_id: input.parentId
        };
    }
    export(args) {
        return this.mapCategory(null);
    }
    mapCategory(parentSlug) {
        var self = this;
        return function (cat) {
            let catSlug = slugify(cat.name, { lower: true });
            let slug = parentSlug ? `${parentSlug}-${catSlug}` : catSlug;
            return {
                id: `${cat.id}`,
                name: cat.name,
                slug,
                parentId: `${cat.parent_id}`,
                children: lodash_1.default.map(cat.children, lodash_1.default.bind(self.mapCategory(slug), self))
            };
        };
    }
}
// end category operations
// product operation
class BigCommerceProductOperation extends BigCommerceOperation {
    constructor(config) {
        super(config);
    }
    getRequestPath(args) {
        return args.id ? `products/${args.id}` : `products`;
    }
    async get(args) {
        return await super.get({
            ...args,
            'id:in': args.productIds,
            include: 'images,variants'
        });
    }
    async post(args) {
        return await super.post({
            ...args,
            body: args.product && this.import(args.product)
        });
    }
    export(args) {
        return prod => ({
            ...prod,
            shortDescription: prod.description,
            longDescription: prod.description,
            slug: slugify(prod.name, { lower: true, remove: /\"/g }),
            variants: lodash_1.default.map(prod.variants, variant => ({
                ...variant,
                prices: {
                    list: formatMoneyString(variant.price || prod.price),
                    sale: formatMoneyString(variant.sale_price || prod.price)
                },
                attributes: variant.option_values.map(opt => ({
                    name: opt.option_display_name.toLowerCase(),
                    value: opt.label
                })),
                images: variant.image_url ? [{ url: variant.image_url }] : lodash_1.default.map(prod.images, mapImage)
            })),
            productType: 'product'
        });
    }
    import(input) {
        return {
            // required BC fields
            name: input.name,
            type: 'physical',
            weight: 0,
            sku: input.sku,
            price: lodash_1.default.first(input.variants).prices.list,
            categories: input.categories,
            variants: lodash_1.default.map(input.variants, variant => ({
                sku: variant.sku,
                price: variant.prices.list,
                // image_url: variant.defaultImage.url,
                option_values: lodash_1.default.map(lodash_1.default.filter(variant.attributes, ({ name, value }) => value), attribute => ({
                    option_display_name: attribute.name,
                    label: attribute.value
                }))
            })),
            images: lodash_1.default.flatMap(input.images, x => ({ image_url: x.url, is_thumbnail: true })),
        };
    }
    postProcessor(args) {
        return async (products) => {
            let operation = new BigCommerceCategoryOperation(this.backend);
            let categories = (await operation.get({})).getResults();
            return lodash_1.default.map(products, prod => ({
                ...prod,
                categories: lodash_1.default.map(prod.categories, id => findCategory(categories, { id: `${id}` }))
            }));
        };
    }
}
// end product operations
module.exports = {
    productOperation: backend => new BigCommerceProductOperation(backend),
    categoryOperation: backend => new BigCommerceCategoryOperation(backend),
};
