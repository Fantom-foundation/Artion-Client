import { ethers } from 'ethers';
import { FantomNFTConstants } from '../constants/smartcontracts/fnft.constants';

const loadSignedContract = async (address, abi) => {
  await window.ethereum.enable();
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
  await window.ethereum.enable();
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     FantomNFTConstants.TESTNETRPC,
  //     FantomNFTConstants.TESTNETCHAINID
  //   );
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(address, abi, signer);
};

const SCHandlers = { loadSignedContract, loadContract };

export default SCHandlers;
