import { GnosisSafeContract, MultiSendContract } from '@gnosis.pm/safe-core-sdk-types';
import { SafeConfig } from '../Safe';
import { ContractNetworksConfig } from '../types';
declare class ContractManager {
    #private;
    static create({ ethAdapter, safeAddress, isL1SafeMasterCopy, contractNetworks }: SafeConfig): Promise<ContractManager>;
    init({ ethAdapter, safeAddress, isL1SafeMasterCopy, contractNetworks }: SafeConfig): Promise<void>;
    get contractNetworks(): ContractNetworksConfig | undefined;
    get isL1SafeMasterCopy(): boolean | undefined;
    get safeContract(): GnosisSafeContract;
    get multiSendContract(): MultiSendContract;
}
export default ContractManager;
