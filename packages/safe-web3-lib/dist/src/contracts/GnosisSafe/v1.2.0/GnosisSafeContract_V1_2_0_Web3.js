"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GnosisSafeContractWeb3_1 = __importDefault(require("../GnosisSafeContractWeb3"));
class GnosisSafeContract_V1_2_0_Web3 extends GnosisSafeContractWeb3_1.default {
    constructor(contract) {
        super(contract);
        this.contract = contract;
    }
    async getModules() {
        return this.contract.methods.getModules().call();
    }
    async isModuleEnabled(moduleAddress) {
        return this.contract.methods.isModuleEnabled(moduleAddress).call();
    }
}
exports.default = GnosisSafeContract_V1_2_0_Web3;
//# sourceMappingURL=GnosisSafeContract_V1_2_0_Web3.js.map