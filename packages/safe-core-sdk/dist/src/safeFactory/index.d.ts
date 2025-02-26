import { EthAdapter, SafeVersion, TransactionOptions } from '@gnosis.pm/safe-core-sdk-types';
import Safe from '../Safe';
import { ContractNetworksConfig } from '../types';
export interface SafeAccountConfig {
    owners: string[];
    threshold: number;
    to?: string;
    data?: string;
    fallbackHandler?: string;
    paymentToken?: string;
    payment?: number;
    paymentReceiver?: string;
}
export interface SafeDeploymentConfig {
    saltNonce: number;
}
export interface DeploySafeProps {
    safeAccountConfig: SafeAccountConfig;
    safeDeploymentConfig?: SafeDeploymentConfig;
    options?: TransactionOptions;
    callback?: (txHash: string) => void;
}
export interface SafeFactoryConfig {
    /** ethAdapter - Ethereum adapter */
    ethAdapter: EthAdapter;
    /** safeVersion - Versions of the Safe deployed by this Factory contract */
    safeVersion?: SafeVersion;
    /** isL1SafeMasterCopy - Forces to use the Gnosis Safe L1 version of the contract instead of the L2 version */
    isL1SafeMasterCopy?: boolean;
    /** contractNetworks - Contract network configuration */
    contractNetworks?: ContractNetworksConfig;
}
declare class SafeFactory {
    #private;
    static create({ ethAdapter, safeVersion, isL1SafeMasterCopy, contractNetworks }: SafeFactoryConfig): Promise<SafeFactory>;
    private init;
    getEthAdapter(): EthAdapter;
    getSafeVersion(): SafeVersion;
    getAddress(): string;
    getChainId(): Promise<number>;
    private encodeSetupCallData;
    deploySafe({ safeAccountConfig, safeDeploymentConfig, options, callback }: DeploySafeProps): Promise<Safe>;
}
export default SafeFactory;
