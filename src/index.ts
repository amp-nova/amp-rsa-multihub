// export function hello() {
//     console.log(`hello!`)
// }
// export class PbxClient {
//     url: string
//     key: string

//     constructor(url, key) {
//         this.url = url
//         this.key = key
//     }

//     sayHello() {
//         console.log(`say hello!`)
//     }
// }

// export default { PbxClient }

// import { PbxClient } from './schemas/types'

// export const createPbxClient = (url, key): PbxClient => {
//     let pbx = new PbxClient(url, key)
//     return pbx
// }

export * from './types'