import { BigNumber } from '@ethersproject/bignumber';
import { EthAdapter, MetaTransactionData, SafeSignature, SafeTransaction, SafeTransactionDataPartial, SafeVersion, TransactionOptions, TransactionResult } from '@gnosis.pm/safe-core-sdk-types';
import ContractManager from './managers/contractManager';
import { ContractNetworksConfig } from './types';
import { SafeTransactionOptionalProps } from './utils/transactions/types';
export interface SafeConfig {
    /** ethAdapter - Ethereum adapter */
    ethAdapter: EthAdapter;
    /** safeAddress - The address of the Safe account to use */
    safeAddress: string;
    /** isL1SafeMasterCopy - Forces to use the Gnosis Safe L1 version of the contract instead of the L2 version */
    isL1SafeMasterCopy?: boolean;
    /** contractNetworks - Contract network configuration */
    contractNetworks?: ContractNetworksConfig;
}
export interface ConnectSafeConfig {
    /** ethAdapter - Ethereum adapter */
    ethAdapter?: EthAdapter;
    /** safeAddress - The address of the Safe account to use */
    safeAddress?: string;
    /** isL1SafeMasterCopy - Forces to use the Gnosis Safe L1 version of the contract instead of the L2 version */
    isL1SafeMasterCopy?: boolean;
    /** contractNetworks - Contract network configuration */
    contractNetworks?: ContractNetworksConfig;
}
export interface AddOwnerTxParams {
    /** ownerAddress - The address of the new owner */
    ownerAddress: string;
    /** threshold - The new threshold */
    threshold?: number;
}
export interface RemoveOwnerTxParams {
    /** ownerAddress - The address of the owner that will be removed */
    ownerAddress: string;
    /** threshold - The new threshold */
    threshold?: number;
}
export interface SwapOwnerTxParams {
    /** oldOwnerAddress - The old owner address */
    oldOwnerAddress: string;
    /** newOwnerAddress - The new owner address */
    newOwnerAddress: string;
}
declare class Safe {
    #private;
    /**
     * Creates an instance of the Safe Core SDK.
     * @param config - Ethers Safe configuration
     * @returns The Safe Core SDK instance
     * @throws "Safe Proxy contract is not deployed on the current network"
     * @throws "MultiSend contract is not deployed on the current network"
     */
    static create({ ethAdapter, safeAddress, isL1SafeMasterCopy, contractNetworks }: SafeConfig): Promise<Safe>;
    /**
     * Initializes the Safe Core SDK instance.
     * @param config - Safe configuration
     * @throws "Signer must be connected to a provider"
     * @throws "Safe Proxy contract is not deployed on the current network"
     * @throws "MultiSend contract is not deployed on the current network"
     */
    private init;
    /**
     * Returns a new instance of the Safe Core SDK.
     * @param config - Connect Safe configuration
     * @throws "Safe Proxy contract is not deployed on the current network"
     * @throws "MultiSend contract is not deployed on the current network"
     */
    connect({ ethAdapter, safeAddress, isL1SafeMasterCopy, contractNetworks }: ConnectSafeConfig): Promise<Safe>;
    /**
     * Returns the address of the current Safe Proxy contract.
     *
     * @returns The address of the Safe Proxy contract
     */
    getAddress(): string;
    /**
     * Returns the ContractManager
     *
     * @returns The current ContractManager
     * */
    getContractManager(): ContractManager;
    /**
     * Returns the current EthAdapter.
     *
     * @returns The current EthAdapter
     */
    getEthAdapter(): EthAdapter;
    /**
     * Returns the address of the MultiSend contract.
     *
     * @returns The address of the MultiSend contract
     */
    getMultiSendAddress(): string;
    /**
     * Returns the Safe Master Copy contract version.
     *
     * @returns The Safe Master Copy contract version
     */
    getContractVersion(): Promise<SafeVersion>;
    /**
     * Returns the list of Safe owner accounts.
     *
     * @returns The list of owners
     */
    getOwners(): Promise<string[]>;
    /**
     * Returns the Safe nonce.
     *
     * @returns The Safe nonce
     */
    getNonce(): Promise<number>;
    /**
     * Returns the Safe threshold.
     *
     * @returns The Safe threshold
     */
    getThreshold(): Promise<number>;
    /**
     * Returns the chainId of the connected network.
     *
     * @returns The chainId of the connected network
     */
    getChainId(): Promise<number>;
    /**
     * Returns the ETH balance of the Safe.
     *
     * @returns The ETH balance of the Safe
     */
    getBalance(): Promise<BigNumber>;
    /**
     * Returns the list of addresses of all the enabled Safe modules.
     *
     * @returns The list of addresses of all the enabled Safe modules
     */
    getModules(): Promise<string[]>;
    /**
     * Checks if a specific Safe module is enabled for the current Safe.
     *
     * @param moduleAddress - The desired module address
     * @returns TRUE if the module is enabled
     */
    isModuleEnabled(moduleAddress: string): Promise<boolean>;
    /**
     * Checks if a specific address is an owner of the current Safe.
     *
     * @param ownerAddress - The account address
     * @returns TRUE if the account is an owner
     */
    isOwner(ownerAddress: string): Promise<boolean>;
    /**
     * Returns a Safe transaction ready to be signed by the owners.
     *
     * @param safeTransactions - The list of transactions to process
     * @returns The Safe transaction
     * @throws "Invalid empty array of transactions"
     */
    createTransaction(safeTransactions: SafeTransactionDataPartial): Promise<SafeTransaction>;
    createTransaction(safeTransactions: MetaTransactionData[], options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns a Safe transaction ready to be signed by the owners that invalidates the pending Safe transaction/s with a specific nonce.
     *
     * @param nonce - The nonce of the transaction/s that are going to be rejected
     * @returns The Safe transaction that invalidates the pending Safe transaction/s
     */
    createRejectionTransaction(nonce: number): Promise<SafeTransaction>;
    /**
     * Returns the transaction hash of a Safe transaction.
     *
     * @param safeTransaction - The Safe transaction
     * @returns The transaction hash of the Safe transaction
     */
    getTransactionHash(safeTransaction: SafeTransaction): Promise<string>;
    /**
     * Signs a hash using the current signer account.
     *
     * @param hash - The hash to sign
     * @returns The Safe signature
     * @throws "Transactions can only be signed by Safe owners"
     */
    signTransactionHash(hash: string): Promise<SafeSignature>;
    /**
     * Adds the signature of the current signer to the Safe transaction object.
     *
     * @param safeTransaction - The Safe transaction to be signed
     */
    signTransaction(safeTransaction: SafeTransaction): Promise<void>;
    /**
     * Approves on-chain a hash using the current signer account.
     *
     * @param hash - The hash to approve
     * @returns The Safe transaction response
     * @throws "Transaction hashes can only be approved by Safe owners"
     * @throws "Cannot specify gas and gasLimit together in transaction options"
     */
    approveTransactionHash(hash: string, options?: TransactionOptions): Promise<TransactionResult>;
    /**
     * Returns a list of owners who have approved a specific Safe transaction.
     *
     * @param txHash - The Safe transaction hash
     * @returns The list of owners
     */
    getOwnersWhoApprovedTx(txHash: string): Promise<string[]>;
    /**
     * Returns the Safe transaction to enable a Safe module.
     *
     * @param moduleAddress - The desired module address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid module address provided"
     * @throws "Module provided is already enabled"
     */
    getEnableModuleTx(moduleAddress: string, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to disable a Safe module.
     *
     * @param moduleAddress - The desired module address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid module address provided"
     * @throws "Module provided is not enabled already"
     */
    getDisableModuleTx(moduleAddress: string, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to add an owner and optionally change the threshold.
     *
     * @param params - The transaction params
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid owner address provided"
     * @throws "Address provided is already an owner"
     * @throws "Threshold needs to be greater than 0"
     * @throws "Threshold cannot exceed owner count"
     */
    getAddOwnerTx({ ownerAddress, threshold }: AddOwnerTxParams, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to remove an owner and optionally change the threshold.
     *
     * @param params - The transaction params
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid owner address provided"
     * @throws "Address provided is not an owner"
     * @throws "Threshold needs to be greater than 0"
     * @throws "Threshold cannot exceed owner count"
     */
    getRemoveOwnerTx({ ownerAddress, threshold }: RemoveOwnerTxParams, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to replace an owner of the Safe with a new one.
     *
     * @param params - The transaction params
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid new owner address provided"
     * @throws "Invalid old owner address provided"
     * @throws "New address provided is already an owner"
     * @throws "Old address provided is not an owner"
     */
    getSwapOwnerTx({ oldOwnerAddress, newOwnerAddress }: SwapOwnerTxParams, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to change the threshold.
     *
     * @param threshold - The new threshold
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Threshold needs to be greater than 0"
     * @throws "Threshold cannot exceed owner count"
     */
    getChangeThresholdTx(threshold: number, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Executes a Safe transaction.
     *
     * @param safeTransaction - The Safe transaction to execute
     * @param options - The Safe transaction execution options (gasLimit, gasPrice)
     * @returns The Safe transaction response
     * @throws "No signer provided"
     * @throws "There are X signatures missing"
     * @throws "Cannot specify gas and gasLimit together in transaction options"
     */
    executeTransaction(safeTransaction: SafeTransaction, options?: TransactionOptions): Promise<TransactionResult>;
}
export default Safe;
