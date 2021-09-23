"use strict";
// export function hello() {
//     console.log(`hello!`)
// }
// export class PbxClient {
//     url: string
//     key: string
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
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
__exportStar(require("./schemas/types"), exports);
