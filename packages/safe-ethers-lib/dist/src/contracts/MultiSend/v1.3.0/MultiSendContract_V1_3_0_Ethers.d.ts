import { MultiSend } from '../../../../typechain/src/ethers-v5/v1.3.0/MultiSend';
import MultiSendEthersContract from '../MultiSendEthersContract';
declare class MultiSendContract_V1_3_0_Ethers extends MultiSendEthersContract {
    contract: MultiSend;
    constructor(contract: MultiSend);
}
export default MultiSendContract_V1_3_0_Ethers;
