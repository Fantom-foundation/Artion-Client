import { ethers } from 'ethers';
import { FantomNFTConstants } from '../constants/smartcontracts/fnft.constants';

const loadSignedContract = async (address, abi) => {
  const provider = new ethers.providers.JsonRpcProvider(
    FantomNFTConstants.TESTNETRPC,
    FantomNFTConstants.TESTNETCHAINID
  );
  const signer = new ethers.Wallet(FantomNFTConstants.PRIVATEKEY, provider);
  let contract = new ethers.Contract(address, abi, signer);
  let signedContract = contract.connect(signer);

  return signedContract;
};

const loadContract = async (address, abi) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return [new ethers.Contract(address, abi, signer), provider];
};

const getAccountBalance = async address => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let balance = await provider.getBalance(address);
  balance = ethers.utils.formatEther(balance);
  return balance;
};

const SCHandlers = { loadSignedContract, loadContract, getAccountBalance };

export default SCHandlers;
