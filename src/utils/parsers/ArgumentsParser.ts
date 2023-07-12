import { TypedValue } from '@multiversx/sdk-core/out';
import { ExternalContractFunction } from 'src/types/ExternalContractFunction';
import { IssueNonFungibleArgumentParser } from './IssueNonFungibleArgumentParser';
import { ESDTNFTCreateArgumentsParser } from './ESDTNFTCreateArgumentsParser';
import { SetSpecialRoleArgumentsParser } from './SetSpecialRoleArgumentsParser';
import { LendInJewelSwapArgumentsParser } from './LendInJewelSwapArgumentsParser';

export interface FunctionArgumentStrategy {
  parseArguments(args: TypedValue[]): any;
}

export class ArgumentsParser {
  private strategyMap: Map<ExternalContractFunction, FunctionArgumentStrategy> =
    new Map();

  constructor() {
    this.strategyMap.set(
      ExternalContractFunction.ISSUE_NON_FUNGIBLE,
      new IssueNonFungibleArgumentParser(),
    );
    this.strategyMap.set(
      ExternalContractFunction.ESDT_NFT_CREATE,
      new ESDTNFTCreateArgumentsParser(),
    );
    this.strategyMap.set(
      ExternalContractFunction.SET_SPECIAL_ROLE,
      new SetSpecialRoleArgumentsParser(),
    );
    this.strategyMap.set(
      ExternalContractFunction.LEND_IN_JEWELSWAP,
      new LendInJewelSwapArgumentsParser(),
    );
  }

  parseArguments(functionName: ExternalContractFunction, args: TypedValue[]) {
    const strategy = this.strategyMap.get(functionName);
    if (!strategy) {
      throw new Error(`No argument parser found for function ${functionName}`);
    }

    return strategy.parseArguments(args);
  }
}
