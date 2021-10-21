const nconf = require('nconf')

const port = process.env.PORT || '6393'
const envName = process.env.COPILOT_ENVIRONMENT_NAME || 'local'
const appName = process.env.COPILOT_APPLICATION_NAME || 'nova'
const serviceName = process.env.COPILOT_SERVICE_NAME || 'aria'
const host = envName === 'local' ? `http://localhost:${port}` : `https://${serviceName}.${envName}.${appName}.${process.env.aria_domain}`

export type AriaConfig = {
    serviceName: string
    mode: string
    host: string
    port: string
}

export const config: AriaConfig = {
    serviceName,
    mode: envName,
    host,
    port
}

export default config