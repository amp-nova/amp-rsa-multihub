const _ = require('lodash')
const https = require('https')
const request = require('../../util/http/short-term-rolling-cache')(5)

class Operation {
    constructor(cred) {
        this.cred = cred
    }

    import(native) {
        return native
    }

    export(args) {
        return native => native
    }

    async get(args) {
        return await this.request({ method: 'get', ...args })
    }

    async post(args) {
        return await this.request({ method: 'post', ...args })
    }

    async put(args) {
        return await this.request({ method: 'put', ...args })
    }

    async delete(args) {
        return await this.request({ method: 'delete', ...args })
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

    async request(args) {
        // get the URL from the backend
        let url = this.getRequest(args)

        try {
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });

            // if (this.args.body) {
            //     console.log(JSON.stringify(this.args.body))
            // }

            // next, execute the request with headers gotten from the backend
            let response = await request({ url, method: args.method, headers: await this.getHeaders(), httpsAgent, data: args.body })

            let x = await this.translateResponse(response.data, _.bind(this.export(args), this))
            x.getResults = () => x.results

            // console.log(JSON.stringify(x.results))

            if (x) {
                let px = await this.postProcessor(args)
                if (px) {
                    x.results = await px(x.results)
                }
    
                if (args.id || args.slug || args.method === 'post') {
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

    getHeaders() {
        return {}
    }
}

module.exports = Operation