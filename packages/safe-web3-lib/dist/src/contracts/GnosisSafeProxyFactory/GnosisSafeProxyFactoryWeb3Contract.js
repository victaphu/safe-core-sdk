"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
class GnosisSafeProxyFactoryWeb3Contract {
    constructor(contract) {
        this.contract = contract;
    }
    getAddress() {
        return this.contract.options.address;
    }
    async createProxy({ safeMasterCopyAddress, initializer, saltNonce, options, callback }) {
        var _a, _b, _c;
        if (saltNonce < 0) {
            throw new Error('saltNonce must be greater than 0');
        }
        if (options && !options.gas) {
            options.gas = await this.estimateGas('createProxyWithNonce', [safeMasterCopyAddress, initializer, saltNonce], {
                ...options
            });
        }
        const txResponse = this.contract.methods
            .createProxyWithNonce(safeMasterCopyAddress, initializer, saltNonce)
            .send(options);
        if (callback) {
            const txResult = await (0, utils_1.toTxResult)(txResponse);
            callback(txResult.hash);
        }
        const txResult = await new Promise((resolve, reject) => txResponse.once('receipt', (receipt) => resolve(receipt)).catch(reject));
        const proxyAddress = (_c = (_b = (_a = txResult.events) === null || _a === void 0 ? void 0 : _a.ProxyCreation) === null || _b === void 0 ? void 0 : _b.returnValues) === null || _c === void 0 ? void 0 : _c.proxy;
        if (!proxyAddress) {
            throw new Error('Safe Proxy was not deployed correctly');
        }
        return proxyAddress;
    }
    encode(methodName, params) {
        return this.contract.methods[methodName](...params).encodeABI();
    }
    async estimateGas(methodName, params, options) {
        try {
            return Number(await this.contract.methods[methodName](...params).estimateGas(options));
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
exports.default = GnosisSafeProxyFactoryWeb3Contract;
//# sourceMappingURL=GnosisSafeProxyFactoryWeb3Contract.js.map