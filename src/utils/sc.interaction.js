import { ethers } from 'ethers';

const loadContract = async (address, abi) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(address, abi, signer);
};

const getAccountBalance = async address => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let balance = await provider.getBalance(address);
  balance = ethers.utils.formatEther(balance);
  return balance;
};

const SCHandlers = { loadContract, getAccountBalance };

export default SCHandlers;
