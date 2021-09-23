"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const logger = require('./logger');
const findCategory = (categories, args) => {
    let mapped = {};
    let flattenCategories = cats => {
        lodash_1.default.each(cats, cat => {
            mapped[cat.id] = cat;
            flattenCategories(cat.children);
        });
    };
    flattenCategories(categories);
    if (args.id) {
        return mapped[args.id];
    }
    else {
        return lodash_1.default.find(lodash_1.default.values(mapped), cat => cat.slug === args.slug);
    }
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const { exec } = require('child_process');
const execAsync = async (command, opts = {}) => {
    let result = null;
    logger.debug(`[ ${command} ] exec`);
    exec(command, (err, stdout, stderr) => {
        result = { err, stdout, stderr };
    });
    while (!result) {
        await sleep(10);
    }
    if (!opts.quiet) {
        if (result.err) {
            logger.error(`[ ${command} ] [ err ] ${result.err.message}`);
        }
        else {
            logger.debug(`[ ${command} ] ${result.stdout}`);
        }
    }
    logger.debug(`[ ${command} ] finished`);
    return result;
};
module.exports = { findCategory, execAsync };
