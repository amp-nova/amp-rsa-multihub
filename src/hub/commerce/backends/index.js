const _ = require('lodash')
const axios = require('axios')
const stringify = require('json-stringify-safe')
const cache = require('./cache')
const https = require('https')

class CommerceBackend {
    constructor(cred, context) {
        this.configs = {}
        this.cred = cred
        this.context = context
    }

    getConfig(key) {
        return this.configs[key]
    }

    async getHeaders() {
        return {}
    }

    getRequest(config, args = {}) {
        let url = this.getRequestURL(config, args)

        // add default args from the query type
        // url.addQuery(config.args || {})
        _.each(config.args, (v, k) => {
            if (!url.hasQuery(k)) {
                url.addQuery({ [k]: v })
            }
        })

        return url.toString()
    }

    getRequestURL() {
        throw new Error(`Connector [ ${this.cred.type} ] must implement getRequestURL()`)
    }

    async request({ key, method = 'get' }, args) {
        let config = this.getConfig(key)

        args.currency = args.currency || 'USD'
        args.locale = args.locale || 'en-US'
        let [language, country] = args.locale.split('-')

        args.language = language
        args.country = country

        // get the URL from the backend
        let url = this.getRequest(config, args)

        try {
            if (false && cache.get(url)) {
                console.log(`[    cac ] ${url}`)
                return cache.get(url)
            }
            else {
                console.log(`[ ${method.padStart(6, ' ')} ] ${url}`)

                const httpsAgent = new https.Agent({ rejectUnauthorized: false });
                
                // next, execute the request with headers gotten from the backend
                let response = await axios({ url, method, headers: await this.getHeaders(), httpsAgent })

                let x = await this.translateResults(response.data, config.mapper(args))

                let px = args.postProcessor || config.postProcessor
                if (px) {
                    x.results = await px(args, x.results)
                }
    
                // use the backend to translate the result set
                cache.set(url, x)
                return x
            }
        } catch (error) {
            console.error(error)
        }

        return {}
    }

    async get(key, args) {
        return await this.request({ key }, args)
    }

    async getOne(key, args) {
        return _.first(_.get(await this.get(key, args), 'results'))
    }

    async getProduct(parent, args, context, info) {
        return await this.getOne('products', args)
    }

    async getProducts(parent, args, context, info) {
        return await this.get('products', args)
    }

    async getCategory(parent, args, context, info) {
        return _.first(await this.getCategoryHierarchy(parent, args, context, info))
    }

    async translateResults(data, mapper = (args => x => x)) {
        if (!data.results) {
            data = {
                limit: 1,
                count: 1,
                total: 1,
                offset: 0,
                results: [data]
            }
        }

        data.results = await Promise.all(data.results.map(await mapper)) 
        return data
    }

    getSource() {
        return `${this.cred.type}/${this.cred.id}`
    }
}

module.exports = CommerceBackend