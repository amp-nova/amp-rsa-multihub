const _ = require('lodash')
const https = require('https')
const request = require('./util/http/short-term-rolling-cache')(30)
// const request = require('../../util/http/no-cache')
const { nanoid } = require('nanoid')

export class Operation {
    backend: any

    constructor(backend) {
        this.backend = backend
    }

    import(native) {
        return native
    }

    export(args) {
        return native => native
    }

    async get(args) {
        return await this.doRequest({ method: 'get', ...args })
    }

    async post(args) {
        return await this.doRequest({ method: 'post', ...args })
    }

    async put(args) {
        return await this.doRequest({ method: 'put', ...args })
    }

    async delete(args) {
        return await this.doRequest({ method: 'delete', ...args })
    }

    getURL(args) {
        return `${this.getBaseURL()}/${this.getRequestPath(args)}`
    }

    getBaseURL() {
        throw new Error("getBaseURL must be defined in an operation subclass")
    }

    getRequestPath(args) {
        return ""
    }

    getRequest(args) {
        let url = this.getURL(args)
        return url.toString()
    }

    postProcessor(args) {
        return native => native
    }

    async doRequest(args) {
        // get the URL from the backend
        let url = this.getRequest(args)

        try {
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            let requestParams = { url, method: args.method, headers: await this.getHeaders(), data: args.body }

            let backendRequestId = `${this.backend.getSource()}.${nanoid(10)}`
            // logger.info(`[ ${chalk.yellow(this.backend.config.context.requestId)} ][ ${args.method.padStart(6, ' ')} ] ${url}`)

            // next, execute the request with headers gotten from the backend
            let response = await request({ ...requestParams, httpsAgent })

            // log the response object
            // mask the auth token first if there is one
            if (requestParams.headers['authorization']) {
                requestParams.headers['authorization'] = requestParams.headers['authorization'].substring(0, requestParams.headers['authorization'].length - 8) + `********`
            }

            this.backend.config.context.logger.logBackendCall({ 
                id: backendRequestId,
                request: requestParams,
                response: response.data
            })
            // end logging the response object

            // console.log(response.data)

            let x: any = await this.translateResponse(response.data, _.bind(this.export(args), this))
            x.getResults = () => x.results

            if (x) {
                let px = await this.postProcessor(args)
                if (px) {
                    x.results = await px(x.results)
                }
    
                if (args.id || args.slug || args.method === 'post') {
                    // console.log(_.first(x.results))
                    return _.first(x.results)
                }
                else {
                    return x
                }
            }
            else if (args.method === 'delete') {
                return args.id
            }

            // use the backend to translate the result set
            // return x
        } catch (error) {
            console.error(error)
        }

        return {}
    }

    translateResponse(data: any, arg1: any) {
        throw new Error("Method not implemented.")
    }

    getHeaders() {
        return {}
    }

    formatMoneyString(money) {
        return new Intl.NumberFormat(this.backend.config.context.locale, {
            style: 'currency',
            currency: this.backend.config.context.currency
        }).format(money);
    }
}

module.exports = { Operation }