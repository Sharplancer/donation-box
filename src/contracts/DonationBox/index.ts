import { ethers } from "ethers";
import contractABI from './abi.json';

const getDonationBoxContract = (address: string, providerOrSigner: ethers.providers.Web3Provider | ethers.Signer) => {
  return new ethers.Contract(address, contractABI, providerOrSigner);
}

export default getDonationBoxContract;