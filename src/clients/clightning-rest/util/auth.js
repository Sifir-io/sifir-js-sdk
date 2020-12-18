"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clnRestHelper = void 0;
const clnRestHelper = ({ macroon = process.env.CLNREST_MACAROON || "", macroonEncodingType = process.env.CLNREST_MACAROON_ENCODING } = {}) => {
    if (!macroon || !macroonEncodingType)
        throw "Lnd transport missing macroon or macroon type";
    const customHeaders = async () => {
        let macroonEncoded = await makeToken(macroon, macroonEncodingType);
        let headers = {
            macaroon: macroon,
            encodingtype: macroonEncodingType
        };
        return headers;
    };
    const makeToken = async (macroon, encoding) => {
        switch (encoding) {
            case "utf8":
                return Buffer.from(macroon).toString("base64");
                break;
            case "base64":
                return Buffer.from(macroon, "base64").toString("hex");
            case "hex":
                return macroon;
            default:
                return macroon;
        }
    };
    return { customHeaders, makeToken };
};
exports.clnRestHelper = clnRestHelper;
