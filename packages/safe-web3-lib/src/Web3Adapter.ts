import { BigNumber } from '@ethersproject/bignumber'
import {
  Eip3770Address,
  EthAdapter,
  EthAdapterTransaction,
  GetContractProps
} from '@gnosis.pm/safe-core-sdk-types'
import { validateEip3770Address } from '@gnosis.pm/safe-core-sdk-utils'
import Web3 from 'web3'
import { Transaction } from 'web3-core'
import { ContractOptions } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import {
  getGnosisSafeProxyFactoryContractInstance,
  getMultiSendContractInstance,
  getSafeContractInstance
} from './contracts/contractInstancesWeb3'
import GnosisSafeContractWeb3 from './contracts/GnosisSafe/GnosisSafeContractWeb3'
import GnosisSafeProxyFactoryWeb3Contract from './contracts/GnosisSafeProxyFactory/GnosisSafeProxyFactoryWeb3Contract'
import MultiSendWeb3Contract from './contracts/MultiSend/MultiSendWeb3Contract'

export interface Web3AdapterConfig {
  /** web3 - Web3 library */
  web3: Web3
  /** signerAddress - Address of the signer */
  signerAddress: string
}

class Web3Adapter implements EthAdapter {
  #web3: Web3
  #signerAddress: string

  constructor({ web3, signerAddress }: Web3AdapterConfig) {
    if (!web3) {
      throw new Error('web3 property missing from options')
    }
    this.#web3 = web3
    this.#signerAddress = signerAddress
  }

  isAddress(address: string): boolean {
    return this.#web3.utils.isAddress(address)
  }

  async getEip3770Address(fullAddress: string): Promise<Eip3770Address> {
    const chainId = await this.getChainId()
    return validateEip3770Address(fullAddress, chainId)
  }

  async getBalance(address: string): Promise<BigNumber> {
    return BigNumber.from(await this.#web3.eth.getBalance(address))
  }

  async getChainId(): Promise<number> {
    return this.#web3.eth.getChainId()
  }

  getSafeContract({
    safeVersion,
    chainId,
    singletonDeployment,
    customContractAddress,
    customContractAbi
  }: GetContractProps): GnosisSafeContractWeb3 {
    const contractAddress = customContractAddress ?? singletonDeployment?.networkAddresses[chainId]
    if (!contractAddress) {
      throw new Error('Invalid Safe Proxy contract address')
    }
    const safeContract = this.getContract(
      contractAddress,
      customContractAbi ?? (singletonDeployment?.abi as AbiItem[])
    )
    return getSafeContractInstance(safeVersion, safeContract)
  }

  getMultiSendContract({
    safeVersion,
    chainId,
    singletonDeployment,
    customContractAddress,
    customContractAbi
  }: GetContractProps): MultiSendWeb3Contract {
    const contractAddress = customContractAddress ?? singletonDeployment?.networkAddresses[chainId]
    if (!contractAddress) {
      throw new Error('Invalid Multi Send contract addresss')
    }
    const multiSendContract = this.getContract(
      contractAddress,
      customContractAbi ?? (singletonDeployment?.abi as AbiItem[])
    )
    return getMultiSendContractInstance(safeVersion, multiSendContract)
  }

  getSafeProxyFactoryContract({
    safeVersion,
    chainId,
    singletonDeployment,
    customContractAddress,
    customContractAbi
  }: GetContractProps): GnosisSafeProxyFactoryWeb3Contract {
    const contractAddress = customContractAddress ?? singletonDeployment?.networkAddresses[chainId]
    if (!contractAddress) {
      throw new Error('Invalid Safe Proxy Factory contract address')
    }
    const proxyFactoryContract = this.getContract(
      contractAddress,
      customContractAbi ?? (singletonDeployment?.abi as AbiItem[])
    )
    return getGnosisSafeProxyFactoryContractInstance(safeVersion, proxyFactoryContract)
  }

  getContract(address: string, abi: AbiItem | AbiItem[], options?: ContractOptions): any {
    return new this.#web3.eth.Contract(abi, address, options)
  }

  async getContractCode(address: string): Promise<string> {
    return this.#web3.eth.getCode(address)
  }

  async isContractDeployed(address: string): Promise<boolean> {
    const contractCode = await this.#web3.eth.getCode(address)
    return contractCode !== '0x'
  }

  async getTransaction(transactionHash: string): Promise<Transaction> {
    return this.#web3.eth.getTransaction(transactionHash)
  }

  async getSignerAddress(): Promise<string> {
    return this.#signerAddress
  }

  signMessage(message: string): Promise<string> {
    return this.#web3.eth.sign(message, this.#signerAddress)
  }

  estimateGas(
    transaction: EthAdapterTransaction,
    callback?: (error: Error, gas: number) => void
  ): Promise<number> {
    return this.#web3.eth.estimateGas(transaction, callback)
  }

  call(transaction: EthAdapterTransaction): Promise<string> {
    return this.#web3.eth.call(transaction)
  }
}

export default Web3Adapter
