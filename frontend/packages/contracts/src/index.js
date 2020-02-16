import erc20Abi from "./abis/erc20";
import ownableAbi from "./abis/ownable";
import token from "./abis/token";

export const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  token,
};

export { default as addresses } from "./addresses";
