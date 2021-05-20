const _ = require('lodash')
const axios = require('axios')
const stringify = require('json-stringify-safe')

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

    getRequestURL(config, args) {
        return "https://www.google.com"
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
        console.log(`[ ${method} ] ${url}`)

        let backendRequest = { url }

        try {
            // next, execute the request with headers gotten from the backend
            let response = await axios({ url, method, headers: await this.getHeaders() })

            backendRequest.response = response
            delete backendRequest.response.request
            this.context.logger.log(`${this.getSource().replace('/', '-')}_request`, stringify(backendRequest, null, 4))

            // wrap the given mapper in a function that will add the source tag (eg, 'commercetools/anyafinn')
            let mapper = async data => ({
                ...await config.mapper(args)(data),
                source: this.getSource(),
                raw: data
            })

            // use the backend to translate the result set
            let x = await this.translateResults(response.data, mapper)

            let px = args.postProcessor || config.postProcessor
            if (px) {
                x.results = await px(args, x.results)
            }

            this.context.logger.log(`${this.getSource().replace('/', '-')}_response`, stringify({ url, results: x }, null, 4))

            // console.log(`x ${JSON.stringify(x)}`)

            return x
        } catch (error) {
            console.error(error)
        }

        return {}
    }

    async get(key, args) {
        return await this.request({ key }, args)
    }

    async getOne(key, args) {
        return _.first(_.get(await this.get(key, { ...args, mode: 'single' }), 'results'))
    }
}

module.exports = CommerceBackend