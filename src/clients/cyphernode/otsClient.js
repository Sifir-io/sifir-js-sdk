"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const transportFactory_1 = __importDefault(require("./util/transportFactory"));
exports.client = ({ transport = transportFactory_1.default() } = {}) => {
    const { get, post } = transport;
    const api = {
        async stamp(fileHash) {
            const stampRct = await post("ots_stamp", { hash: fileHash });
            return stampRct;
        },
        async verifyFileStamp(stamp, file) {
            const stampRct = await post("ots_verify", {
                hash: stamp,
                base64otsfile: file || undefined
            });
            return stampRct;
        },
        async getStamp(fileHash) {
            const poop = await get("ots_getfile", fileHash);
            return poop;
        }
    };
    return api;
};
