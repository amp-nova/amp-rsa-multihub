"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// aws translate
const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");
const client = new TranslateClient();
const translate = async (t, language) => Array.isArray(t) ? translateMany(t, language) : translateOne(t, language);
const translateOne = async (text, language) => (await client.send(new TranslateTextCommand({
    SourceLanguageCode: 'auto',
    TargetLanguageCode: language,
    TerminologyNames: null,
    Text: text
}))).TranslatedText;
const translateMany = async (arr, language) => await Promise.all(arr.map(x => translateOne(x, language)));
// end aws translate
exports.default = translate;
