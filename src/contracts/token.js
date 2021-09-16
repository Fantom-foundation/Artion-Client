import useContract from 'hooks/useContract';

import {
  ERC20_CONTRACT_ABI,
  ERC721_CONTRACT_ABI,
  ERC1155_CONTRACT_ABI,
} from './abi';

export const useNFTContract = () => {
  const { getContract } = useContract();

  const getERC20Contract = async address =>
    await getContract(address, ERC20_CONTRACT_ABI);

  const getERC721Contract = async address =>
    await getContract(address, ERC721_CONTRACT_ABI);

  const getERC1155Contract = async address =>
    await getContract(address, ERC1155_CONTRACT_ABI);

  return { getERC20Contract, getERC721Contract, getERC1155Contract };
};
