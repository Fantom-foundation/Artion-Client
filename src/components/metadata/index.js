import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import 'react-notifications/lib/notifications.css';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

import { ethers } from 'ethers';

const useStyles = makeStyles(() => ({
  container: {
    width: '40%',
    height: '80%',
    background: 'white',
    position: 'fixed',
    right: '36px',
    top: '12%',
  },
  inkContainer: {
    borderBottom: '1px dotted blue',
  },
  inkMetadataInput: {
    margin: '24px',
    backgroundColor: '#ffffff !important',
    background: 'transparent !important',
  },
  inkButton: {
    width: '30%',
    letterSpacing: '11px',
    fontFamily: 'monospace',
    fontSize: 'x-large',
    backgroundColor: '#007bff !important',
    margin: '0 0 24px 0',
  },
  inkInputContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inkButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inkDescriptionContainer: {
    marginTop: '40px',
    marginBottom: '40px',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Metadata = () => {
  const classes = useStyles();

  const [name, setName] = useState('New NFT');
  const [limit, setLimit] = useState(1);
  const [description, setDescription] = useState('');
  // const [address, setAddress] = useState('');

  const createNotification = type => {
    switch (type) {
      case 'info':
        NotificationManager.info('Your asset has been successfully created');
        break;
      case 'success':
        NotificationManager.success(
          'Your asset has been successfully created',
          'Success'
        );
        break;
      case 'warning':
        NotificationManager.warning(
          'Warning message',
          'Close after 3000ms',
          3000
        );
        break;
      case 'error':
        NotificationManager.error(
          'Failed in creating your asset',
          'Error',
          5000,
          () => {
            alert('callback');
          }
        );
        break;
    }
  };

  const handleInputChange = (value, target) => {
    switch (target) {
      case 'name':
        {
          setName(value);
        }
        break;
      case 'limit':
        {
          setLimit(value);
        }
        break;
      case 'description':
        {
          setDescription(value);
        }
        break;
      default: {
        console.log('default');
      }
    }
  };

  const validateMetadata = address => {
    return name != '' && (limit >= 1) & (address != '');
  };

  const connectWallet = async () => {
    await window.ethereum.enable();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let accounts = await provider.listAccounts();
    // setAddress(accounts[0]);
    return accounts[0];
  };

  const saveToFile = async () => {
    let address = await connectWallet();
    console.log('created from ', address);
    if (!validateMetadata(address)) return;
    let canvas = document.getElementById('drawingboard');
    let formData = new FormData();
    formData.append('image', canvas.toDataURL());
    formData.append('name', name);
    formData.append('limit', limit);
    formData.append('address', address);
    formData.append('description', description);
    try {
      let result = await axios({
        method: 'post',
        url: 'http://localhost:5000/ipfs/uploadImage2Server',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileHash = result.data.fileHash;
      const jsonHash = result.data.jsonHash;

      console.log('file hash is ', fileHash, ' json hash is ', jsonHash);

      let status = result.data.status;
      switch (status) {
        case 'success':
          {
            createNotification('info');
          }
          break;
        case 'failed':
          {
            createNotification('error');
          }
          break;
        default: {
          console.log('default status');
        }
      }
    } catch (error) {
      createNotification('error');
    }
  };

  return (
    <div className={classes.container}>
      <NotificationContainer />
      <div className={classes.inkContainer}>
        <div className={classes.inkInputContainer}>
          <TextField
            className={classes.inkMetadataInput}
            label="Name"
            variant="filled"
            id="inkmetadatanameinput"
            defaultValue={name}
            onChange={e => {
              handleInputChange(e.target.value, 'name');
            }}
          />
          <TextField
            className={classes.inkMetadataInput}
            label="Limit"
            variant="filled"
            type="number"
            id="inkmetadatalimitinput"
            defaultValue={limit}
            onChange={e => {
              handleInputChange(e.target.value, 'limit');
            }}
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
          />
        </div>
        <div className={classes.inkDescriptionContainer}>
          <TextField
            label="description(Optional)"
            style={{ textAlign: 'left' }}
            hinttext="Message Field"
            defaultValue={description}
            floatinglabeltext="MultiLine and FloatingLabel"
            multiline
            rows={2}
            onChange={e => {
              handleInputChange(e.target.value, 'description');
            }}
          />
        </div>
        <div className={classes.inkButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.inkButton}
            onClick={saveToFile}
          >
            Ink
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Metadata;
