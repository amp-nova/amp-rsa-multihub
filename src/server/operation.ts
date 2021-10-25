const _ = require('lodash')
const https = require('https')
// const request = require('./util/http/short-term-rolling-cache')(30)
// const request = require('../../util/http/no-cache')

import { QueryContext } from "../types"
import { rollingCache } from "./util/http/short-term-rolling-cache"
const request = rollingCache(30)

const { nanoid } = require('nanoid')

export class Operation {
    backend: any

    constructor(backend) {
        this.backend = backend
    }

    import(native) {
        return native
    }

    export(context: QueryContext) {
        return native => native
    }

    async get(context: QueryContext) {
        return await this.doRequest({ method: 'get', ...context })
    }

    async post(context: QueryContext) {
        return await this.doRequest({ method: 'post', ...context })
    }

    async put(context: QueryContext) {
        return await this.doRequest({ method: 'put', ...context })
    }

    async delete(context: QueryContext) {
        return await this.doRequest({ method: 'delete', ...context })
    }

    getURL(context: QueryContext) {
        return `${this.getBaseURL()}${this.getRequestPath(context)}`
    }

    getBaseURL() {
        throw "getBaseURL must be defined in an operation subclass"
    }

    getRequestPath(context: QueryContext) {
        return ""
    }

    getRequest(context: QueryContext) {
        let url = this.getURL(context)
        return url.toString()
    }

    postProcessor(context: QueryContext) {
        return native => native
    }

    async doRequest(context: QueryContext) {
        // get the URL from the backend
        let url = this.getRequest(context)

        try {
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            let requestParams = { url, method: context.method, headers: await this.getHeaders(), data: context.args.body }

            // if (args.body) {
            //     console.log(`data`)
            //     console.log(JSON.stringify(args.body))
            // }

            let backendRequestId = `${this.backend.getSource()}.${nanoid(10)}`
            // logger.info(`[ ${chalk.yellow(this.backend.config.context.requestId)} ][ ${args.method.padStart(6, ' ')} ] ${url}`)


            console.log(`[ GET ] ${requestParams.url}`)

            // next, execute the request with headers gotten from the backend
            let response = await request({ ...requestParams, httpsAgent })

            // log the response object
            // mask the auth token first if there is one
            if (requestParams.headers['authorization']) {
                requestParams.headers['authorization'] = requestParams.headers['authorization'].substring(0, requestParams.headers['authorization'].length - 8) + `********`
            }

            // this.backend.config.context.logger.logCodecCall({ 
            //     id: backendRequestId,
            //     request: requestParams,
            //     response: response.data
            // })
            // end logging the response object

            // console.log(response.data)

            let x: any = await this.translateResponse(response.data, _.bind(this.export(context), this))
            x.getResults = () => x.results

            if (x) {
                let px = await this.postProcessor(context)
                if (px) {
                    x.results = await px(x.results)
                }
    
                if (context.args.id || context.args.slug) {
                    // console.log(_.first(x.results))
                    return _.first(x.results)
                }
                else {
                    return x
                }
            }
            else if (context.args.method === 'delete') {
                return context.args.id
            }

            // use the backend to translate the result set
            // return x
        } catch (error) {
            console.error(error)
        }

        return {}
    }

    translateResponse(data: any, arg1: any) {
        throw "Method not implemented."
    }

    getHeaders() {
        return {}
    }

    formatMoneyString(money, args) {
        return new Intl.NumberFormat(args.locale, {
            style: 'currency',
            currency: args.currency
        }).format(money);
    }
}

module.exports = { Operation }