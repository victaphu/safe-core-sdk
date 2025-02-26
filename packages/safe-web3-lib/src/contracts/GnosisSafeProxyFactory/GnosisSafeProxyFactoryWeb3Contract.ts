import { GnosisSafeProxyFactoryContract } from '@gnosis.pm/safe-core-sdk-types'
import { TransactionReceipt } from 'web3-core/types'
import { ProxyFactory as ProxyFactory_V1_1_1 } from '../../../typechain/src/web3-v1/v1.1.1/proxy_factory'
import { ProxyFactory as ProxyFactory_V1_3_0 } from '../../../typechain/src/web3-v1/v1.3.0/proxy_factory'
import { Web3TransactionOptions } from '../../types'
import { toTxResult } from '../../utils'

export interface CreateProxyProps {
  safeMasterCopyAddress: string
  initializer: string
  saltNonce: number
  options?: Web3TransactionOptions
  callback?: (txHash: string) => void
}

class GnosisSafeProxyFactoryWeb3Contract implements GnosisSafeProxyFactoryContract {
  constructor(public contract: ProxyFactory_V1_3_0 | ProxyFactory_V1_1_1) {}

  getAddress(): string {
    return this.contract.options.address
  }

  async createProxy({
    safeMasterCopyAddress,
    initializer,
    saltNonce,
    options,
    callback
  }: CreateProxyProps): Promise<string> {
    if (saltNonce < 0) {
      throw new Error('saltNonce must be greater than 0')
    }
    if (options && !options.gas) {
      options.gas = await this.estimateGas(
        'createProxyWithNonce',
        [safeMasterCopyAddress, initializer, saltNonce],
        {
          ...options
        }
      )
    }
    const txResponse = this.contract.methods
      .createProxyWithNonce(safeMasterCopyAddress, initializer, saltNonce)
      .send(options)

    if (callback) {
      const txResult = await toTxResult(txResponse)
      callback(txResult.hash)
    }

    const txResult: TransactionReceipt = await new Promise((resolve, reject) =>
      txResponse.once('receipt', (receipt: TransactionReceipt) => resolve(receipt)).catch(reject)
    )
    const proxyAddress = txResult.events?.ProxyCreation?.returnValues?.proxy
    if (!proxyAddress) {
      throw new Error('Safe Proxy was not deployed correctly')
    }
    return proxyAddress
  }

  encode(methodName: string, params: any[]): string {
    return (this.contract as any).methods[methodName](...params).encodeABI()
  }

  async estimateGas(
    methodName: string,
    params: any[],
    options: Web3TransactionOptions
  ): Promise<number> {
    try {
      return Number(
        await (this.contract.methods as any)[methodName](...params).estimateGas(options)
      )
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default GnosisSafeProxyFactoryWeb3Contract
