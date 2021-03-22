const { default: axios } = require('axios');

const readMetadataFromIPFS = async path => {
  let fileContent = await axios.get(path);
  let status = fileContent.status;
  if (status != 200) return '';
  fileContent = fileContent.data;
  return fileContent;
};

const IPFSHandler = {
  readMetadataFromIPFS,
};

export default IPFSHandler;
