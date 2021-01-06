"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agent = __importStar(require("superagent"));
const superagent_proxy_1 = __importDefault(require("superagent-proxy"));
exports.default = (param) => {
    const { gatewayUrl, proxyUrl, customHeaders, caCert } = param;
    // Extend superagent with proxyUrl
    if (proxyUrl && proxyUrl.length) {
        superagent_proxy_1.default(agent);
    }
    const transport = {
        async get(command, payload) {
            const request = agent.get(`${gatewayUrl}${command}${payload ? "/" + payload : ""}`);
            if (proxyUrl) {
                request.proxy(proxyUrl);
            }
            if (caCert) {
                request.ca(caCert);
            }
            if (typeof customHeaders === "function") {
                const headers = await customHeaders({ command, payload });
                if (headers)
                    request.set(headers);
            }
            const { body } = await request.send();
            return body;
        },
        async post(command, payload) {
            const request = agent.post(`${gatewayUrl}${command}`);
            if (proxyUrl) {
                request.proxy(proxyUrl);
            }
            if (caCert) {
                request.ca(caCert);
            }
            if (typeof customHeaders === "function") {
                const headers = await customHeaders({ command, payload });
                if (headers)
                    request.set(headers);
            }
            const { body } = await request.send(payload);
            return body;
        },
        async delete(command, payload) {
            const request = agent.delete(`${gatewayUrl}${command}${payload ? "/" + payload : ""}`);
            if (proxyUrl) {
                request.proxy(proxyUrl);
            }
            if (caCert) {
                request.ca(caCert);
            }
            if (typeof customHeaders === "function") {
                const headers = await customHeaders({ command, payload });
                if (headers)
                    request.set(headers);
            }
            const { body } = await request.send();
            return body;
        }
    };
    return {
        ...transport
    };
};
