import { BigNumber } from '@ethersproject/bignumber';
import { SafeTransaction, SafeTransactionData, SafeVersion, TransactionOptions, TransactionResult } from '../types';
export interface GnosisSafeContract {
    getVersion(): Promise<SafeVersion>;
    getAddress(): string;
    getNonce(): Promise<number>;
    getThreshold(): Promise<number>;
    getOwners(): Promise<string[]>;
    isOwner(address: string): Promise<boolean>;
    getTransactionHash(safeTransactionData: SafeTransactionData): Promise<string>;
    approvedHashes(ownerAddress: string, hash: string): Promise<BigNumber>;
    approveHash(hash: string, options?: TransactionOptions): Promise<TransactionResult>;
    getModules(): Promise<string[]>;
    isModuleEnabled(moduleAddress: string): Promise<boolean>;
    execTransaction(safeTransaction: SafeTransaction, options?: TransactionOptions): Promise<TransactionResult>;
    encode(methodName: string, params: any): string;
    estimateGas(methodName: string, params: any[], options: TransactionOptions): Promise<number>;
}
