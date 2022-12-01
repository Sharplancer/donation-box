import Web3 from "web3";

const web3 = new Web3('https://goerli.infura.io/v3/cee807039b5a4f25b41fa4e8920eb273');

export const formatAccount = (account: string) => {
  return !!account && account.substring(0, 7) + '...' + account.substring(account.length - 5, account.length);
}

export const getEthBalance = async (account: string) => {
  if (!account) return '';
  const balance = await web3.eth.getBalance(account);
  return web3.utils.fromWei(balance);
}

export const formatEth = (amount: string) => {
  return parseFloat(amount).toPrecision(8);
}