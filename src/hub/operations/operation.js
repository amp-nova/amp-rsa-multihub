const _ = require('lodash')
const axios = require('axios')
const https = require('https')

class Operation {
    constructor(args, cred) {
        this.args = {
            currency: 'USD',
            locale: 'en-US',
            language: 'en',
            country: 'US',
            ...args
        }
        this.cred = cred
    }

    mapInput(native) {
        return native
    }

    mapOutput(native) {
        return native
    }

    async get() {
        return await this.request('get')
    }

    async post() {
        return await this.request('post')
    }

    async put() {
        return await this.request('put')
    }

    async delete() {
        return await this.request('delete')
    }

    getRequest() {
        let url = this.getRequestURL()
        return url.toString()
    }

    async request(method = 'get') {
        // get the URL from the backend
        let url = this.getRequest()

        try {
            console.log(`[ ${method.padStart(6, ' ')} ] ${url}`)

            const httpsAgent = new https.Agent({ rejectUnauthorized: false });

            // if (this.args.body) {
            //     console.log(JSON.stringify(this.args.body))
            // }

            // next, execute the request with headers gotten from the backend
            let response = await axios({ url, method, headers: await this.getHeaders(), httpsAgent, data: this.args.body })

            let x = await this.translateResponse(response.data, _.bind(this.mapOutput, this))

            // console.log(x)

            if (x) {
                let px = this.postProcessor && _.bind(this.postProcessor, this)
                if (px) {
                    x.results = await px(x.results)
                }
    
                if (this.args.id || this.args.slug || method === 'post') {
                    return _.first(x.results)
                }
                else {
                    return x
                }
            }
            else if (method === 'delete') {
                return this.args.id
            }

            // use the backend to translate the result set
            // return x
        } catch (error) {
            console.error(error)
        }

        return {}
    }
}

module.exports = Operation