"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowAsQueryParam = void 0;
const shallowAsQueryParam = (obj) => Object.entries(obj)
    .map(([key, val]) => val && `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .filter(x => !!x)
    .join("&");
exports.shallowAsQueryParam = shallowAsQueryParam;
