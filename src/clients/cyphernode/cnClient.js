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
        async getConfigProps() {
            const { cyphernode_props } = await get("config_props");
            return cyphernode_props;
        },
        async setConfigProp(property, value) {
            return await post("config_props", { property, value });
        }
    };
    return api;
};